import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getAllShortLinks,
  deleteShortLink,
  updateShortLink,
} from "./api";
import {
  ClipboardDocumentIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import Alert from "../../components/alert";
import ButtonIcon from '../../components/button-icon';
import Button from '../../components/button';
import ShortLinkEdit from "./edit";

const SHORTLINK_BASE_URL = "https://enlaza.com";
const PAGE_SIZE = 12;
const buildShortUrl = (shortCode) => `${SHORTLINK_BASE_URL}/${shortCode}`;

const statusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          Activo
        </span>
      );
    case "expired":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-300 text-gray-600">
          Expirado
        </span>
      );
    case "disabled":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          Deshabilitado
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-200 text-neutral-700">
          {status}
        </span>
      );
  }
};

const ShortLinksViewer = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null); // Edición rápida (URL)
  const [editUrl, setEditUrl] = useState("");
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(true);

  const [showFull, setShowFull] = useState({});

  // Scroll infinito
  // eslint-disable-next-line
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Para saber si el usuario está editando para evitar cargar más mientras edita
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Nuevo estado para edición completa (modal)
  const [editFullId, setEditFullId] = useState(null);

  // Estado para éxito de edición rápida
  const [quickEditSuccess, setQuickEditSuccess] = useState({}); // { [id]: true|false }
  // Estado para error de edición rápida
  const [quickEditError, setQuickEditError] = useState({}); // { [id]: string }

  // Ref para scrollear el mensaje de éxito/error a la vista en edición rápida
  const quickEditMsgRef = useRef({});

  // Modal de confirmación de eliminación
  const [deleteModal, setDeleteModal] = useState({ open: false, linkId: null });

  useEffect(() => {
    setLinks([]);
    setOffset(0);
    setHasMore(true);
    fetchLinks(0, true);
    return () => setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar más links
  const fetchLinks = async (offsetToUse = 0, replace = false) => {
    setLoading(true);
    try {
      const data = await getAllShortLinks({ limit: PAGE_SIZE, offset: offsetToUse });
      // Suponiendo que el backend retorna { data: { items: [...], hasMore: true/false } }
      const newLinks = data.data.items || [];
      setLinks((prev) => replace ? newLinks : [...prev, ...newLinks]);
      setHasMore(Boolean(data.data.hasMore));
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los enlaces.");
      setShowError(true);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Scroll infinito observer
  const lastLinkRef = useCallback((node) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
        setIsFetchingMore(true);
        setOffset((prevOffset) => {
          const newOffset = prevOffset + PAGE_SIZE;
          fetchLinks(newOffset);
          return newOffset;
        });
      }
    });
    if (node) observer.current.observe(node);
    // eslint-disable-next-line
  }, [loading, hasMore, isFetchingMore]);

  const handleCopy = async (shortUrl) => {
    await navigator.clipboard.writeText(shortUrl);
  };

  // Edición rápida (solo URL)
  const handleEdit = (id, url) => {
    setEditId(id);
    setEditUrl(url);
    setQuickEditSuccess({});
    setQuickEditError({});
  };

  const handleEditSave = async (id) => {
    setProcessing(true);
    setLoading(true);
    setQuickEditSuccess({});
    setQuickEditError({});
    try {
      await updateShortLink(id, { originalUrl: editUrl });
      setQuickEditSuccess({ [id]: true });
      // Scroll a la alerta de éxito
      setTimeout(() => {
        if (quickEditMsgRef.current[id]) {
          quickEditMsgRef.current[id].scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
      // Oculta el input rápido tras 1.5s y actualiza la lista
      setTimeout(() => {
        setEditId(null);
        setQuickEditSuccess({});
        setLinks([]);
        setOffset(0);
        setHasMore(true);
        fetchLinks(0, true);
      }, 1500);
      setError(null);
    } catch {
      setQuickEditError({ [id]: "Error actualizando el enlace" });
      setShowError(true);
      // Scroll a la alerta de error
      setTimeout(() => {
        if (quickEditMsgRef.current[id]) {
          quickEditMsgRef.current[id].scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  // Edición completa (abrir/cerrar)
  const handleFullEdit = (id) => {
    setEditFullId(id);
  };

  const handleEditClose = (shouldReload) => {
    setEditFullId(null);
    if (shouldReload) {
      setLinks([]);
      setOffset(0);
      setHasMore(true);
      fetchLinks(0, true);
    }
  };

  // Ahora solo elimina, no pregunta confirmación aquí (se hace en modal)
  const handleDelete = async (id) => {
    setProcessing(true);
    setLoading(true);
    try {
      await deleteShortLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setError(null);
    } catch {
      setError("Error eliminando el enlace");
      setShowError(true);
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  const toggleShowFull = (id) => {
    setShowFull((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Recarga manual
  const handleReload = () => {
    setLinks([]);
    setOffset(0);
    setHasMore(true);
    fetchLinks(0, true);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {error && showError && (
        <Alert
          type="error"
          message={error}
          onClose={() => setShowError(false)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Mis enlaces acortados</h2>
        <ButtonIcon
          onClick={handleReload}
          className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
          disabled={loading}
          loading={loading}
          title="Recargar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12a7.5 7.5 0 111.95 5.1M4.5 12V8.25M4.5 12h3.75"
            />
          </svg>
          Recargar
        </ButtonIcon>
      </div>

      {/* Modal de edición completa */}
      {editFullId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div
            className="bg-white rounded-2xl shadow-lg max-w-xl w-full relative p-4 max-h-[90vh] overflow-y-auto"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <ShortLinkEdit
              shortLinkId={editFullId}
              onUpdated={() => handleEditClose(true)}
              onCancel={() => handleEditClose(false)}
            />
            <ButtonIcon
              className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700"
              onClick={() => handleEditClose(false)}
              title="Cerrar"
            >
              <XMarkIcon className="h-6 w-6" />
            </ButtonIcon>
          </div>
        </div>
      )}

      {loading && links.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      ) : links.length === 0 ? (
        <div className="text-neutral-500 text-center">No tienes enlaces creados aún.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {links.map((link, idx) => {
            const isLast = idx === links.length - 1;
            return (
              <div
                key={link.id}
                ref={isLast ? lastLinkRef : undefined}
                className="relative bg-white/90 rounded-xl shadow-lg p-6 transition hover:shadow-2xl border border-neutral-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="w-3/4">
                    <div className="text-xs text-neutral-400">Corto:</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-primary">
                        {buildShortUrl(link.shortCode)}
                      </span>
                      <ButtonIcon
                        onClick={() => handleCopy(buildShortUrl(link.shortCode))}
                        className="p-1 rounded hover:bg-primary/10 transition"
                        title="Copiar URL"
                      >
                        <ClipboardDocumentIcon className="h-5 w-5 text-primary" />
                      </ButtonIcon>
                    </div>
                    {link.customCode && (
                      <div className="text-xs text-neutral-500 mt-1">
                        Código personalizado: <span className="font-mono">{link.customCode}</span>
                      </div>
                    )}
                    {link.branding && link.branding.name && (
                      <div className="text-xs text-blue-600 mt-1">
                        Marca: <span className="font-semibold">{link.branding.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {/* Edición rápida (solo URL) */}
                    <ButtonIcon
                      className="p-1 rounded hover:bg-sky-100 transition"
                      onClick={() => handleEdit(link.id, link.originalUrl)}
                      disabled={processing}
                      title="Editar destino rápido"
                      loading={processing}
                    >
                      <PencilIcon className="h-5 w-5 text-sky-600" />
                    </ButtonIcon>
                    {/* Edición completa (modal) */}
                    <ButtonIcon
                      className="p-1 rounded hover:bg-yellow-100 transition"
                      onClick={() => handleFullEdit(link.id)}
                      disabled={processing}
                      title="Editar todo"
                      loading={processing}
                    >
                      <Cog6ToothIcon className="h-5 w-5 text-yellow-600" />
                    </ButtonIcon>
                    {/* Eliminar */}
                    <ButtonIcon
                      className="p-1 rounded hover:bg-red-100 transition"
                      onClick={() => setDeleteModal({ open: true, linkId: link.id })}
                      disabled={processing}
                      title="Eliminar"
                      loading={processing}
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </ButtonIcon>
                  </div>
                </div>
                {/* Estado debajo del destino corto y customCode */}
                <div className="mt-2 mb-1">
                  {statusBadge(link.status)}
                </div>
                <div className="mb-2">
                  <div className="text-xs text-neutral-400">Destino:</div>
                  {editId === link.id ? (
                    <div>
                      {/* Mensaje éxito/fracaso edición rápida */}
                      {(quickEditSuccess[link.id] || quickEditError[link.id]) && (
                        <div
                          ref={el => quickEditMsgRef.current[link.id] = el}
                          className={`flex items-center gap-2 mb-2 p-2 rounded
                            ${quickEditSuccess[link.id]
                              ? "bg-primary-50 border-l-4 border-primary-500"
                              : "bg-red-50 border-l-4 border-red-500"
                            }`}
                        >
                          {quickEditSuccess[link.id] ? (
                            <>
                              <CheckIcon className="h-5 w-5 text-primary-500" />
                              <div>
                                <div className="text-primary-700">¡URL actualizada exitosamente!</div>
                                <div className="text-xs text-primary-600 mt-1">
                                  El campo se ocultará automáticamente.
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <XMarkIcon className="h-5 w-5 text-red-500" />
                              <div>
                                <div className="text-red-700">{quickEditError[link.id]}</div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-primary/30 rounded focus:ring-2 focus:ring-primary/50"
                          value={editUrl}
                          onChange={e => setEditUrl(e.target.value)}
                          disabled={processing || quickEditSuccess[link.id]}
                        />
                        <ButtonIcon
                          onClick={() => handleEditSave(link.id)}
                          className="p-1 rounded bg-green-500 hover:bg-green-600 text-white transition"
                          disabled={processing || quickEditSuccess[link.id]}
                          title="Guardar"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </ButtonIcon>
                        <ButtonIcon
                          onClick={() => setEditId(null)}
                          className="p-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 transition"
                          disabled={processing || quickEditSuccess[link.id]}
                          title="Cancelar"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </ButtonIcon>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`break-all text-neutral-700 transition-all ${!showFull[link.id] ? "line-clamp-2" : ""}`}
                        style={{
                          display: "block",
                          maxHeight: !showFull[link.id] ? "2.7em" : "none",
                          overflow: !showFull[link.id] ? "hidden" : "visible",
                          wordBreak: "break-all",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {!showFull[link.id] && link.originalUrl && link.originalUrl.length > 40
                          ? link.originalUrl.slice(0, 40) + "..."
                          : link.originalUrl}
                      </span>
                      {link.originalUrl && link.originalUrl.length > 40 && (
                        <button
                          className="ml-2 text-primary underline text-xs"
                          onClick={() => toggleShowFull(link.id)}
                        >
                          {showFull[link.id] ? "Ver menos" : "Ver más"}
                        </button>
                      )}
                    </>
                  )}
                  {link.password && (
                    <div className="flex items-center text-xs text-red-600 gap-1 mt-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-2v2a2 2 0 002 2h8a2 2 0 002-2v-2m-6 0V9m6 6V9a6 6 0 00-12 0v6" />
                      </svg>
                      Protegido con contraseña
                    </div>
                  )}
                  {link.expiresAt && (
                    <div className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                      </svg>
                      Expira: {new Date(link.expiresAt).toLocaleString()}
                    </div>
                  )}
                  {link.isOneTime && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium mt-1">
                      <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11.3 1.046A1 1 0 009.9 2.137l-5 11A1 1 0 005.8 15h3.7l-1.1 3.553a1 1 0 001.7 1.007l7.5-10.553A1 1 0 0016.2 5h-3.7l1.1-3.553a1 1 0 00-1.3-1.401z" />
                      </svg>
                      Solo un uso
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {link.tags && link.tags.length > 0 ? (
                    link.tags.map((tag) => (
                      <span key={tag.id || tag.name} className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        <TagIcon className="h-3 w-3" />
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-400 text-xs">Sin tags</span>
                  )}
                </div>
                <div className="mt-3 text-xs text-neutral-400">
                  Creado: {link.createdAt ? new Date(link.createdAt).toLocaleString() : "--"}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Loader para scroll infinito */}
      {loading && links.length > 0 && (
        <div className="flex justify-center items-center p-4">
          <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}
      {!hasMore && links.length > 0 && (
        <div className="text-neutral-400 text-center text-xs mt-4 mb-8">No hay más enlaces.</div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4 text-red-700">Eliminar enlace corto</h3>
            <p className="mb-6 text-neutral-700">¿Seguro que quieres eliminar este enlace? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setDeleteModal({ open: false, linkId: null })}
              >Cancelar</Button>
              <Button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  await handleDelete(deleteModal.linkId);
                  setDeleteModal({ open: false, linkId: null });
                }}
              >Eliminar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortLinksViewer;
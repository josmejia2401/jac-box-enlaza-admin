import React, { useEffect, useState } from "react";
import { getRulesByShortlink, deleteRule } from "./api";
import RuleItem from "./item";
import RuleForm from "./form";
import ConfirmDialog from "./delete";

const RulesList = ({ shortLinkId }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Nuevo: estado para el mensaje de error
  const [error, setError] = useState(null);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRulesByShortlink(shortLinkId);
      // Si el backend responde con éxito pero sin data, aún debería mostrar vacío
      setRules(data?.data || []);
    } catch (e) {
      setError(
        e?.message ||
          "Ocurrió un error al cargar las reglas. Intenta de nuevo más tarde."
      );
      setRules([]); // Evita que el estado quede inconsistente
    }
    setLoading(false);
  };

  useEffect(() => {
    if (shortLinkId) fetchRules();
  }, [shortLinkId]);

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleDelete = (ruleId) => {
    setPendingDeleteId(ruleId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteRule(pendingDeleteId);
      setShowConfirm(false);
      setPendingDeleteId(null);
      fetchRules();
    } catch (e) {
      setError(
        e?.message ||
          "No se pudo eliminar la regla. Por favor, intenta de nuevo."
      );
      setShowConfirm(false);
      setPendingDeleteId(null);
    }
    setDeleting(false);
  };

  const handleCreate = () => {
    setEditingRule(null);
    setShowForm(true);
  };

  const handleFormClose = (updated) => {
    setShowForm(false);
    if (updated) fetchRules();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Reglas del Shortlink</h3>
        <button
          onClick={handleCreate}
          className="bg-primary-600 text-white px-4 py-2 rounded"
        >
          Nueva regla
        </button>
      </div>

      {/* Muestra el error arriba del listado */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3 flex items-center justify-between">
          <span>{error}</span>
          <button
            className="ml-2"
            onClick={() => setError(null)}
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div>Cargando reglas...</div>
      ) : rules.length === 0 ? (
        <div className="text-neutral-400">
          No hay reglas configuradas para este shortlink.
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <RuleItem
              key={rule.id}
              rule={rule}
              onEdit={() => handleEdit(rule)}
              onDelete={() => handleDelete(rule.id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <RuleForm
          shortLinkId={shortLinkId}
          rule={editingRule}
          onClose={handleFormClose}
        />
      )}

      <ConfirmDialog
        open={showConfirm}
        title="Eliminar regla"
        description="¿Estás seguro que deseas eliminar esta regla? Esta acción no se puede deshacer."
        onCancel={() => {
          setShowConfirm(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
};

export default RulesList;
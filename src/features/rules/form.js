import React, { useState } from "react";
import { createRule, updateRule } from "./api";

const conditionTypes = [
  { id: "country", label: "País" },
  { id: "city", label: "Ciudad" },
  { id: "device", label: "Dispositivo" },
  { id: "browser", label: "Navegador" },
  { id: "os", label: "Sistema Operativo" }
];
const actionTypes = [
  { id: "redirect", label: "Redireccionar" },
  { id: "block", label: "Bloquear" },
  { id: "captcha", label: "CAPTCHA" },
  { id: "message", label: "Mensaje" },
  { id: "landing_page", label: "Landing" }
];

const RuleForm = ({ shortLinkId, rule, onClose }) => {
  const [form, setForm] = useState({
    conditionType: rule?.conditionType || "",
    conditionValue: rule?.conditionValue || "",
    actionType: rule?.actionType || "",
    actionValue: rule?.actionValue || "",
    priority: rule?.priority ?? 1 // default to 1 if not present
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...form,
        shortLinkId: shortLinkId,
        priority: Number(form.priority)
      };
      if (rule) {
        await updateRule(rule.id, payload);
        setSuccess("¡Regla actualizada exitosamente!");
      } else {
        await createRule(payload);
        setSuccess("¡Regla creada exitosamente!");
      }
      // Opcional: cerrar el modal automáticamente después de 1.5 segundos
      setTimeout(() => {
        onClose(true);
      }, 1500);
    } catch (err) {
      setError(err.message || "No se pudo guardar la regla");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <form className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6" onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold mb-4">{rule ? "Editar regla" : "Nueva regla"}</h3>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 flex items-center justify-between">
            <span>{error}</span>
            <button type="button" className="ml-2" onClick={() => setError(null)}>✕</button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-3 flex items-center justify-between">
            <span>{success}</span>
            <button type="button" className="ml-2" onClick={() => setSuccess(null)}>✕</button>
          </div>
        )}
        <div className="mb-3">
          <label className="block font-medium mb-1">Condición</label>
          <select name="conditionType" value={form.conditionType} onChange={handleChange} required className="w-full border rounded p-2">
            <option value="">Selecciona una condición</option>
            {conditionTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.label}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">Valor de condición</label>
          <input name="conditionValue" value={form.conditionValue} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">Acción</label>
          <select name="actionType" value={form.actionType} onChange={handleChange} required className="w-full border rounded p-2">
            <option value="">Selecciona una acción</option>
            {actionTypes.map(at => <option key={at.id} value={at.id}>{at.label}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">Parámetros de acción (opcional)</label>
          <input name="actionValue" value={form.actionValue} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">Prioridad</label>
          <input
            name="priority"
            type="number"
            min={1}
            value={form.priority}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => onClose(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded" disabled={saving || !!success}>
            {saving ? "Guardando..." : rule ? "Guardar cambios" : "Crear regla"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RuleForm;
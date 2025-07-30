import React from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  ShieldExclamationIcon,
  ChatBubbleLeftEllipsisIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  ClockIcon,
  CursorArrowRaysIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

// Labels y mapeo de iconos para condición
const conditionLabels = {
  country: { label: "País", icon: <GlobeAltIcon className="h-5 w-5 text-blue-500" /> },
  city: { label: "Ciudad", icon: <GlobeAltIcon className="h-5 w-5 text-blue-400" /> },
  device: { label: "Dispositivo", icon: <DevicePhoneMobileIcon className="h-5 w-5 text-green-600" /> },
  browser: { label: "Navegador", icon: <CursorArrowRaysIcon className="h-5 w-5 text-pink-500" /> },
  os: { label: "Sistema Operativo", icon: <ComputerDesktopIcon className="h-5 w-5 text-orange-500" /> },
  referrer: { label: "Referente", icon: <ArrowPathIcon className="h-5 w-5 text-gray-500" /> },
  date: { label: "Fecha", icon: <CalendarDaysIcon className="h-5 w-5 text-amber-500" /> },
  day_of_week: { label: "Día de semana", icon: <CalendarDaysIcon className="h-5 w-5 text-amber-400" /> },
  hour: { label: "Hora", icon: <ClockIcon className="h-5 w-5 text-indigo-500" /> },
  clicks: { label: "Clicks", icon: <AdjustmentsHorizontalIcon className="h-5 w-5 text-fuchsia-500" /> }
};

const actionLabels = {
  redirect: { label: "Redirección", icon: <ArrowPathIcon className="h-5 w-5 text-green-600" /> },
  block: { label: "Bloquear", icon: <ShieldExclamationIcon className="h-5 w-5 text-red-600" /> },
  captcha: { label: "CAPTCHA", icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" /> },
  message: { label: "Mensaje", icon: <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-blue-600" /> },
  rate_limit: { label: "Rate limit", icon: <DocumentTextIcon className="h-5 w-5 text-purple-600" /> },
  landing_page: { label: "Landing", icon: <DocumentTextIcon className="h-5 w-5 text-amber-600" /> }
};

const RuleItem = ({ rule, onEdit, onDelete }) => (
  <div className="border rounded-xl p-4 flex justify-between items-center bg-gradient-to-r from-white via-slate-50 to-purple-50 shadow-sm hover:shadow-lg transition">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold mr-2">
          {conditionLabels[rule.conditionType]?.icon}
          <span className="ml-1">{conditionLabels[rule.conditionType]?.label || rule.conditionType}</span>
        </span>
        <span className="text-gray-700 font-medium">{rule.conditionValue}</span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-semibold mr-2">
          {actionLabels[rule.actionType]?.icon}
          <span className="ml-1">{actionLabels[rule.actionType]?.label || rule.actionType}</span>
        </span>
        <span className="text-gray-700 font-medium">{rule.actionValue}</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Prioridad: <span className="font-bold">{rule.priority}</span>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        title="Editar"
        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
      >
        <PencilSquareIcon className="h-5 w-5 text-blue-700" />
      </button>
      <button
        onClick={onDelete}
        title="Eliminar"
        className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
      >
        <TrashIcon className="h-5 w-5 text-red-700" />
      </button>
    </div>
  </div>
);

export default RuleItem;
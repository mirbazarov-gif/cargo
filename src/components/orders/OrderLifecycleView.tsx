import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  Download,
  Eye,
  FileCheck,
  FilePlus,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Lock,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Send,
  Shield,
  ShieldCheck,
  Star,
  Truck,
  Upload,
  User,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, OrderStatus, ReviewCriteria } from '../../types';
import { formatPrice, formatVolume, formatWeight } from '../../utils/matching';

const ORDER_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'created', label: '1. Заказ создан', desc: 'Сделка инициирована' },
  { status: 'carrier_selected', label: '2. Перевозчик выбран', desc: 'Предложение принято' },
  { status: 'confirmed', label: '3. Заказ подтверждён', desc: 'Контакты открыты' },
  { status: 'going_to_pickup', label: '4. Машина едет на загрузку', desc: 'Водитель в пути к складу' },
  { status: 'loaded', label: '5. Груз загружен', desc: 'ТТН оформлена, кузов опломбирован' },
  { status: 'in_transit', label: '6. В пути', desc: 'Машина следует по трассе' },
  { status: 'arrived', label: '7. Прибыл', desc: 'Транспорт на пункте выгрузки' },
  { status: 'unloading', label: '8. Разгрузка', desc: 'Приемка товара получателем' },
  { status: 'delivered', label: '9. Доставка подтверждена', desc: 'Акт подписан' },
  { status: 'completed', label: '10. Завершено', desc: 'Взаимные отзывы и расчет' },
];

export const OrderLifecycleView: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    currentUser,
    currentRole,
    updateOrderStatus,
    sendChatMessage,
    chatMessages,
    uploadDocument,
    submitReview,
    setCurrentView,
    viewCarrierProfile,
    viewShipperProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'tracking' | 'documents' | 'chat' | 'review'>('timeline');
  const [chatInput, setChatInput] = useState('');
  const [newStatusComment, setNewStatusComment] = useState('');
  const [newStatusLocation, setNewStatusLocation] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('Акт приёма-передачи груза');
  const [docType, setDocType] = useState<DocumentItem['type']>('act');

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [criteria, setCriteria] = useState<ReviewCriteria>({
    reliability: 5,
    timeliness: 5,
    vehicleState: 5,
    communication: 5,
    timelyPayment: 5,
    accurateCargoInfo: 5,
  });
  const [reviewComment, setReviewComment] = useState('Отличная работа, все доставлено в сохранности и точно по графику.');

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 text-center">
        <p className="text-slate-500">Заказ не найден</p>
        <button
          onClick={() => setCurrentView('orders')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Вернуться к заказам
        </button>
      </div>
    );
  }

  const isCarrier = currentRole === 'carrier' || currentUser.id === order.carrierId;
  const isShipper = currentRole === 'shipper' || currentUser.id === order.shipperId;

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.status === order.status);
  const orderMessages = chatMessages.filter((m) => m.orderId === order.id);

  const handleNextStatus = () => {
    if (currentStepIndex < ORDER_STEPS.length - 1) {
      const nextStatus = ORDER_STEPS[currentStepIndex + 1].status;
      updateOrderStatus(order.id, nextStatus, newStatusComment || undefined, newStatusLocation || undefined);
      setNewStatusComment('');
      setNewStatusLocation('');

      if (nextStatus === 'completed' || nextStatus === 'delivered') {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(order.id, chatInput.trim());
    setChatInput('');
  };

  const handleDocumentUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadDocument(order.id, {
      title: docTitle,
      type: docType,
      fileName: `${docType}_signed_${order.orderNumber}.pdf`,
      fileSize: '1.4 MB',
    });
    setIsUploadModalOpen(false);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(order.id, {
      overallRating: reviewRating,
      criteria,
      comment: reviewComment,
    });
    setIsReviewModalOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back and Breadcrumbs */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('orders')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Все заказы и рейсы</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Безопасная сделка:</span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Договор CargoMatch активен</span>
            </span>
          </div>
        </div>

        {/* Big Top Order Header with Status (Section 12 requirement: Показывай текущий статус крупно) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {order.orderNumber}
                </span>
                <span className="text-xs text-slate-400 font-medium">• Создан {order.createdAt.substring(0, 10)}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Комиссия {order.commissionRate * 100}% ({order.commissionAmount} сом)
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center space-x-3">
                <span>{order.cargo.originCity}</span>
                <ArrowRight className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <span>{order.cargo.destinationCity}</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {order.cargo.title} ({formatWeight(order.cargo.weightTons)} · {formatVolume(order.cargo.volumeM3)})
              </p>
            </div>

            {/* Current Prominent Status Pill (Section 12) */}
            <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl flex flex-col items-end text-right min-w-[260px]">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Текущий статус доставки
              </span>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {ORDER_STEPS[currentStepIndex]?.label || order.status}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{order.currentLocationName}</span>
              </p>
            </div>
          </div>

          {/* Quick Counterparties Details with Security Contacts Rule (Section 18 & 26) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-800/50 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Грузовладелец</span>
                <span className="font-extrabold text-white text-sm">{order.shipperName}</span>
                <div className="text-slate-300 font-mono mt-0.5">{order.shipperPhone}</div>
              </div>
              <button
                onClick={() => viewShipperProfile(order.shipperId)}
                className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[11px] font-semibold text-slate-200"
              >
                Профиль
              </button>
            </div>

            <div className="bg-slate-800/50 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Перевозчик</span>
                <span className="font-extrabold text-white text-sm">{order.carrierName}</span>
                <div className="text-emerald-300 font-medium mt-0.5">
                  {order.vehicleName} ({order.vehiclePlate}) • {order.carrierPhone}
                </div>
              </div>
              <button
                onClick={() => viewCarrierProfile(order.carrierId)}
                className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[11px] font-semibold text-slate-200"
              >
                Профиль
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 text-xs sm:text-sm font-bold space-x-2">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'timeline'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>10-Step Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'tracking'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Карта и трекинг</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'documents'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Документы ({order.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'chat'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Чат заказа ({orderMessages.length})</span>
          </button>
        </div>

        {/* TAB 1: 10-STEP TIMELINE (Section 12 requirement) */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Пошаговый статус выполнения заказа
                </h3>
                <p className="text-xs text-slate-500">
                  Строгая последовательность статусов обеспечивает прозрачность и безопасность обеих сторон
                </p>
              </div>

              {/* Status Advancer Button for Driver/Shipper */}
              {currentStepIndex < ORDER_STEPS.length - 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleNextStatus}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition transform active:scale-95 flex items-center space-x-1.5"
                  >
                    <span>Перевести в «{ORDER_STEPS[currentStepIndex + 1].label}»</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {order.status === 'delivered' && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition"
                >
                  ★ Оставить взаимный отзыв
                </button>
              )}
            </div>

            {/* 10-STEP VISUAL PROGRESS LINE */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                {ORDER_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.status}
                      className={`p-3 rounded-2xl border text-left transition ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-extrabold shadow-md scale-105 z-10'
                          : isDone
                          ? 'bg-slate-900 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="text-[10px] font-mono mb-1">
                        {isDone ? '✓ ' : ''}Шаг {idx + 1}
                      </div>
                      <div className="text-xs font-bold leading-tight line-clamp-2">
                        {step.label.replace(/^\d+\.\s*/, '')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* History Logs */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Журнал действий и отметок:
              </h4>

              <div className="divide-y divide-slate-100">
                {order.statusHistory.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-start space-x-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                        <span className="text-slate-400 text-[11px]">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-600">{item.comment}</p>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Автор отметки: {item.updatedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROUTE MAP & TRACKING (Section 13) */}
        {activeTab === 'tracking' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Отслеживание маршрута: {order.cargo.originCity} → {order.cargo.destinationCity}
                </h3>
                <p className="text-xs text-slate-500">
                  Расстояние ~{order.cargo.distanceKm} км • Расчетное время: {order.cargo.estimatedHours} ч
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold">
                Текущий прогресс: {order.currentProgressPercent}%
              </div>
            </div>

            {/* Visual Route Checkpoint Tracker (Section 13: Место загрузки → Текущая точка → Место выгрузки) */}
            <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5 text-white font-bold">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{order.cargo.originCity} ({order.cargo.originAddress})</span>
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  {order.currentLocationName}
                </span>
                <span className="flex items-center space-x-1.5 text-white font-bold">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{order.cargo.destinationCity} ({order.cargo.destinationAddress})</span>
                </span>
              </div>

              {/* Highway progress line */}
              <div className="relative">
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${order.currentProgressPercent}%` }}
                  />
                </div>
                <div
                  className="absolute -top-3.5 transform -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                  style={{ left: `${Math.max(5, Math.min(95, order.currentProgressPercent))}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded-full mt-1 border border-slate-700 whitespace-nowrap">
                    {order.currentProgressPercent}% пути
                  </span>
                </div>
              </div>

              {/* Highway checkpoints in Kyrgyzstan */}
              <div className="grid grid-cols-4 gap-2 text-[11px] pt-4 text-slate-400 border-t border-slate-800">
                <div>
                  <span className="text-white block font-semibold">1. Выезд: Бишкек</span>
                  <span>Погрузка выполнена</span>
                </div>
                <div>
                  <span className="text-white block font-semibold">2. Төө-Ашуу (3586 м)</span>
                  <span>Тоннель пройден</span>
                </div>
                <div>
                  <span className="text-white block font-semibold">3. Токтогул</span>
                  <span>Трасса М41</span>
                </div>
                <div>
                  <span className="text-white block font-semibold">4. Прибытие: Ош</span>
                  <span>Разгрузка</span>
                </div>
              </div>
            </div>

            {/* Quick Status and Location Update Form for Driver */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                Ручная отметка геопозиции и статуса (для водителя):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Текущая локация (например: Перевал Төө-Ашуу, км 135)"
                  value={newStatusLocation}
                  onChange={(e) => setNewStatusLocation(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Примечание (дорожная обстановка, погода...)"
                  value={newStatusComment}
                  onChange={(e) => setNewStatusComment(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>
              <button
                onClick={handleNextStatus}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Обновить статус и локацию
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS (Section 14: ТТН, Акт, Договор, Фото пломбы, Подтверждение) */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Документооборот заказа (ЭДО)
                </h3>
                <p className="text-xs text-slate-500">
                  Электронные ТТН, акты выполненных работ и фотофиксация пломбы для юридической чистоты сделки
                </p>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-2 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Загрузить документ / Фото</span>
              </button>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Проверен
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{doc.fileName} ({doc.fileSize})</p>
                    <p className="text-[10px] text-slate-400">Загрузил: {doc.uploadedBy} • {doc.uploadedAt}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => alert(`Просмотр документа: ${doc.title}`)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Открыть</span>
                    </button>
                    <button
                      onClick={() => alert(`Скачивание файла: ${doc.fileName}`)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Скачать</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Upload Modal */}
            {isUploadModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-lg text-slate-900">Загрузить документ</h3>
                    <button onClick={() => setIsUploadModalOpen(false)}>
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={handleDocumentUploadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Тип документа</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                      >
                        <option value="waybill">Товарно-транспортная накладная (ТТН)</option>
                        <option value="act">Акт приёма-передачи</option>
                        <option value="contract">Договор-заявка</option>
                        <option value="cargo_photo">Фотография пломбы / погрузки</option>
                        <option value="delivery_proof">Подтверждение доставки получателем</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Название документа</label>
                      <input
                        type="text"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                        required
                      />
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 hover:border-emerald-500 cursor-pointer">
                      <FilePlus className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs text-slate-600 font-medium">Нажмите для выбора PDF или Фото</div>
                      <div className="text-[10px] text-slate-400">PDF, JPG, PNG до 15 МБ</div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
                    >
                      Прикрепить к заказу
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: EMBEDDED CHAT (Section 18) */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Внутренний чат по заказу #{order.orderNumber}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Связан с рейсом {order.cargo.originCity} → {order.cargo.destinationCity}
              </span>
            </div>

            {/* Messages box */}
            <div className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {orderMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isSystem = msg.senderId === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-full">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.senderName}</span>
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs ${
                        isMe
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          isMe ? 'text-slate-400' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Напишите сообщение водителю или грузовладельцу..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Отправить</span>
              </button>
            </form>
          </div>
        )}

        {/* MUTUAL REVIEW MODAL (Section 17) */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    Оценка перевозки
                  </span>
                  <h3 className="text-xl font-black text-slate-900">Взаимный отзыв</h3>
                </div>
                <button onClick={() => setIsReviewModalOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Overall Rating */}
                <div className="text-center py-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Общая оценка:</span>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition ${
                          star <= reviewRating ? 'text-amber-400 scale-110' : 'text-slate-300 hover:text-amber-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Criteria breakdown (Section 17) */}
                <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="font-bold text-slate-700 mb-1">Оценка по критериям (1-5):</div>
                  <div className="flex justify-between items-center">
                    <span>Своевременность и пунктуальность:</span>
                    <span className="font-bold text-emerald-700">5 / 5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Состояние кузова и сохранность груза:</span>
                    <span className="font-bold text-emerald-700">5 / 5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Вежливость и коммуникация:</span>
                    <span className="font-bold text-emerald-700">5 / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Текстовый отзыв:
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition"
                >
                  Опубликовать отзыв
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import Modal from '../Modal.jsx'

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  busy = false,
  tone = 'danger',
}) {
  const confirmClass =
    tone === 'danger'
      ? 'bg-error hover:opacity-90 text-white'
      : 'bg-brand-gold hover:bg-[#b7830a] text-white'

  return (
    <Modal
      open={open}
      onClose={() => !busy && onClose?.()}
      title={title}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => !busy && onClose?.()}
            disabled={busy}
            className="text-sm font-bold text-brand-navy/70 hover:text-brand-navy px-4 h-10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`disabled:opacity-60 transition-colors font-bold text-sm px-5 h-10 rounded-xl ${confirmClass}`}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      }
    >
      <div className="text-sm text-brand-navy/80 leading-relaxed">{message}</div>
    </Modal>
  )
}

export default ConfirmDialog

function Toast({
  text,
  type,
  status = 'hidden',
}: {
  text: string;
  type: string;
  status: string;
}) {
  // Normalize type to ensure it works with DaisyUI alert classes
  let alertType = type;
  if (!type.startsWith('alert-')) {
    switch (type) {
      case 'success':
        alertType = 'alert-success';
        break;
      case 'error':
        alertType = 'alert-error';
        break;
      case 'warning':
        alertType = 'alert-warning';
        break;
      case 'info':
        alertType = 'alert-info';
        break;
      default:
        alertType = 'alert-info';
    }
  }

  return (
    <div
      role="alert"
      className={`${
        status === 'hidden' ? 'hidden' : 'block'
      } alert ${alertType} mt-8`}
    >
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg> */}
      <span dangerouslySetInnerHTML={{ __html: text }}></span>
    </div>
  );
}
export default Toast;

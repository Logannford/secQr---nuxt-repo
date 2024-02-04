export default defineAppConfig({
  ui: {
    button: {
      base: '!bg-white text-black rounded-lg duration-300',
      variant: {
        outline: 'border border-gray-400 hover:!bg-light-purple/50 px-6 py-2',
      },
    },
    formGroup: {
      default: '!text-start',
      label: '!text-white  !font-light !text-sm',
    },
    input: {
      base: '!rounded-lg !text-white !py-2 !ring-slate-100',
      color: 'bg-[#000814] text-white',
      padding: {
        md: 'px-4 py-3',
      },
      placeholder: '!opacity-50',
    },
    notification: {
      position: 'top-0 bottom-auto',
      progress: {
        background: 'bg-light-purple',
      },
    },
  },
});

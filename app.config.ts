export default defineAppConfig({
  ui: {
    button: {
      base: '!bg-white text-black rounded-lg duration-300',
      variant: {
        outline:
          'border !bg-transparent !text-white [&>span]:relative [&>span]:after:bg-white [&>span]:after:absolute [&>span]:after:h-0.5 [&>span]:after:w-0 [&>span]:after:bottom-0 [&>span]:after:left-0 hover:[&>span]:after:w-full [&>span]:after:transition-all [&>span]:after:duration-300 cursor-pointer [&>span]:hover:opacity-95 px-6 py-2',
      },
    },
    checkbox: {
      background: 'checked:!bg-light-purple',
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

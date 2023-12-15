export default defineAppConfig({
  ui: {
    button: {
      base: '!bg-white text-black rounded-lg duration-300',
      variant: {
        outline: 'border border-gray-400 hover:!bg-light-purple/50 px-6 py-2',
      },
    },
    notification: {
      position: 'top-0 bottom-auto',
      progress: {
        background: 'bg-light-purple',
      },
    },
  },
});

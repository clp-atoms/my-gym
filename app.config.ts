export default defineAppConfig({
  ui: {
    modal: {
      overlay: {
        base: "fixed inset-0 z-40 transition-opacity duration-200 bg-gray-500/20 dark:bg-gray-900/50 pointer-events-auto",
        transition: {
          enter: "ease-out duration-200",
          enterFrom: "opacity-0",
          enterTo: "opacity-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
        },
      },
      base: "relative w-full z-50 flex items-center justify-center",
      container: "w-full relative z-50 mx-auto",
      inner: "relative w-full flex flex-col max-h-[calc(100vh-3rem)]",
    },
  },
});

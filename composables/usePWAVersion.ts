export const usePWAVersion = () => {
  const version = ref<string | null>(null);
  const isLoading = ref(false);

  const fetchVersion = async () => {
    if (!process.client) return;

    isLoading.value = true;
    try {
      // Add cache-busting query param to ensure fresh manifest
      const response = await fetch("/manifest.json?v=" + Date.now());
      const manifest = await response.json();
      version.value = manifest.version;
      console.log("[PWA Version] Current version:", version.value);
    } catch (err) {
      console.warn("[PWA Version] Failed to fetch version:", err);
      version.value = "unknown";
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch version on mount
  onMounted(() => {
    fetchVersion();
  });

  // Refresh version when window regains focus
  if (process.client) {
    window.addEventListener("focus", fetchVersion);
  }

  return {
    version,
    isLoading,
    refreshVersion: fetchVersion,
  };
};

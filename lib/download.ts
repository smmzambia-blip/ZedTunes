export async function downloadFile(url: string, filename: string) {
  try {
    // We attempt to fetch the file to trigger a download without opening a NEW tab
    // This requires CORS to be allowed on the source URL
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error("Download helper failed, using standard link fallback", error);
    // If CORS is blocked or fetch fails, we use a hidden link with [download] attribute
    // Note: Browser might still open it in a new tab if it can't handle the download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    // We don't use target="_blank" as requested
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

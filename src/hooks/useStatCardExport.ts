
import { useCallback } from 'react';
import html2canvas from 'html2canvas';

interface ExportOptions {
  playerName: string;
  points: number;
  date: string;
}

export const useStatCardExport = () => {
  const exportToImage = useCallback(async (
    elementId: string, 
    options: ExportOptions,
    action: 'download' | 'share' = 'download'
  ) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(element, {
        backgroundColor: '#1f2937', // Gray-800 background
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 500, // 4:5 ratio for social media
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png', 0.95);
      });

      const fileName = `${options.playerName.replace(/\s+/g, '_')}_${options.points}pts_${options.date}.png`;

      if (action === 'share' && navigator.share) {
        // Use Web Share API if available
        const file = new File([blob], fileName, { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: `${options.playerName} Performance`,
          text: `Check out ${options.playerName}'s game stats!`
        });
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      return { success: true, fileName };
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Export failed' };
    }
  }, []);

  return { exportToImage };
};


import { WebhookPayload } from '../types';

export const validateWebhook = async (url: string): Promise<boolean> => {
  const regex = /^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;
  return regex.test(url);
};

export const getWebhookDetails = async (url: string): Promise<{ name?: string, avatar_url?: string } | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    let avatar_url = undefined;
    if (data.avatar && data.id) {
      avatar_url = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
    }
    
    return { 
      name: data.name, 
      avatar_url 
    };
  } catch (e) {
    return null;
  }
};

export const sendWebhook = async (
  url: string, 
  payload: WebhookPayload, 
  files: File[] = []
): Promise<{ success: boolean; error?: string }> => {
  try {
    const formData = new FormData();
    
    formData.append('payload_json', JSON.stringify(payload));
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.ok || response.status === 204) {
      return { success: true };
    } else {
      let errorMsg = 'Unknown error';
      try {
        const errData = await response.json();
        errorMsg = errData.message || JSON.stringify(errData, null, 2);
      } catch (e) {
        errorMsg = `Status: ${response.status} ${response.statusText}`;
      }
      return { success: false, error: errorMsg };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

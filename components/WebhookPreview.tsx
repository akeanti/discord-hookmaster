import React from 'react';
import { WebhookPayload, DiscordComponent } from '../types';

interface WebhookPreviewProps {
  payload: WebhookPayload;
}

const WebhookPreview: React.FC<WebhookPreviewProps> = ({ payload }) => {
  const getColorHex = (colorInt?: number) => {
    if (colorInt === undefined || colorInt === null) return '#202225';
    return '#' + colorInt.toString(16).padStart(6, '0');
  };

  const renderComponent = (component: DiscordComponent, index: number) => {
    if (component.type === 1) {
      return (
        <div key={index} className="flex flex-wrap gap-3 mb-2">
          {component.components?.map((child, cIdx) => renderComponent(child, cIdx))}
        </div>
      );
    }

    // Button (Type 2)
    if (component.type === 2) {
      const styleClasses: Record<number, string> = {
        1: 'bg-[#5865F2] hover:bg-[#4752c4] text-white', // Primary
        2: 'bg-[#4E5058] hover:bg-[#6D6F78] text-white', // Secondary
        3: 'bg-[#248046] hover:bg-[#1a6334] text-white', // Success
        4: 'bg-[#DA373C] hover:bg-[#a1282c] text-white', // Danger
        5: 'bg-[#4E5058] hover:bg-[#6D6F78] text-white', // Link?
      };

      const btnClass = styleClasses[component.style || 1] || styleClasses[1];
      const isDisabled = component.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

      return (
        <a 
          key={index}
          href={component.style === 5 ? component.url : undefined}
          target="_blank"
          rel="noreferrer"
          className={`${btnClass} ${isDisabled} px-4 py-1.5 rounded-[3px] text-sm font-medium transition-colors flex items-center gap-2 min-h-[32px]`}
          onClick={(e) => component.style !== 5 && e.preventDefault()}
        >
          {component.emoji?.name && <span>{component.emoji.name}</span>}
          {component.label}
          {component.style === 5 && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          )}
        </a>
      );
    }

    // Select Menu (Type 3, 5, 6, 7, 8)
    if ([3, 5, 6, 7, 8].includes(component.type)) {
      const isDisabled = component.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';
      return (
        <div key={index} className={`w-full bg-[#2b2d31] border border-[#1e1f22] rounded p-2 text-[#dbdee1] text-sm flex justify-between items-center ${isDisabled}`}>
          <span className="text-[#949BA4]">{component.placeholder || "Select an option"}</span>
          <svg className="w-4 h-4 text-[#dbdee1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-[#313338] p-4 rounded-md font-sans text-[#dbdee1] max-w-full overflow-hidden select-text">
      <div className="flex flex-row items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          <img 
            src={payload.avatar_url || "https://cdn.discordapp.com/embed/avatars/0.png"} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full bg-[#1e1f22]"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png"; }}
          />
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center -mt-1">
            <span className="font-medium text-white mr-2 hover:underline cursor-pointer">
              {payload.username || "Spidey Bot"}
            </span>
            <span className="bg-[#5865F2] text-white text-[10px] px-1 rounded-[3px] font-medium leading-4 h-4 inline-flex items-center justify-center uppercase">
              App
            </span>
            <span className="text-xs text-[#949BA4] ml-2">Today at 12:00 PM</span>
          </div>

          {/* Normal Text Content */}
          {payload.content && (
            <div className="text-[#dbdee1] whitespace-pre-wrap mt-1 mb-1 leading-[1.375rem]">
              {payload.content}
            </div>
          )}

          {/* Embeds */}
          <div className="space-y-2 mt-1">
            {payload.embeds?.map((embed, idx) => (
              <div 
                key={idx} 
                className="flex bg-[#2b2d31] rounded border-l-4 overflow-hidden max-w-[520px]"
                style={{ borderLeftColor: getColorHex(embed.color) }}
              >
                <div className="p-4 grid gap-2 flex-1 min-w-0">
                  
                  {/* Top Section: Author & Body */}
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0 grid gap-2 content-start">
                      
                      {/* Author */}
                      {embed.author && (embed.author.name || embed.author.icon_url) && (
                        <div className="flex items-center gap-2 mb-1">
                          {embed.author.icon_url && (
                            <img src={embed.author.icon_url} className="w-6 h-6 rounded-full" alt="" />
                          )}
                          <span className="text-sm font-semibold text-white">{embed.author.name}</span>
                        </div>
                      )}

                      {/* Title */}
                      {embed.title && (
                        <div className="text-base font-semibold text-white break-words">
                          {embed.url ? (
                            <a href={embed.url} target="_blank" rel="noreferrer" className="text-[#00A8FC] hover:underline">
                              {embed.title}
                            </a>
                          ) : (
                            embed.title
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {embed.description && (
                        <div className="text-sm text-[#dbdee1] whitespace-pre-wrap break-words">
                          {embed.description}
                        </div>
                      )}

                      {/* Fields */}
                      {embed.fields && embed.fields.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {embed.fields.map((field, fIdx) => (
                            <div key={fIdx} className={`${field.inline ? 'flex-grow-0 w-fit min-w-[30%]' : 'w-full'} min-w-0`}>
                              <div className="text-xs font-semibold text-[#b5bac1] mb-1">{field.name}</div>
                              <div className="text-sm text-[#dbdee1] whitespace-pre-wrap break-words">{field.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail (Right side) */}
                    {embed.thumbnail?.url && (
                      <div className="flex-shrink-0">
                         <img 
                          src={embed.thumbnail.url} 
                          alt="Thumbnail" 
                          className="max-w-[80px] max-h-[80px] rounded object-cover" 
                        />
                      </div>
                    )}
                  </div>

                  {/* Image (Bottom big image) */}
                  {embed.image?.url && (
                    <div className="mt-2 rounded overflow-hidden">
                      <img src={embed.image.url} alt="Embed" className="max-w-full rounded object-cover" />
                    </div>
                  )}

                  {/* Footer */}
                  {embed.footer && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#b5bac1]">
                      {embed.footer.icon_url && <img src={embed.footer.icon_url} className="w-5 h-5 rounded-full" alt="" />}
                      <span>
                        {embed.footer.text}
                        {embed.footer.text && embed.timestamp && ` • `}
                        {embed.timestamp && (
                          <span>{new Date(embed.timestamp).toLocaleString()}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Components (Action Rows) */}
          {payload.components && payload.components.length > 0 && (
            <div className="mt-2 space-y-2">
               {payload.components.map((component, idx) => renderComponent(component, idx))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebhookPreview;

'use client';

import React from 'react';
import { useOSStore, APP_CONFIGS } from '@/lib/store/os.store';
import { Window } from './Window';
import { ProjectsApp } from '@/components/apps/projects/ProjectsApp';
import { AboutApp } from '@/components/apps/about/AboutApp';
import { LabApp } from '@/components/apps/lab/LabApp';
import { SkillsApp } from '@/components/apps/skills/SkillsApp';
import { CreativeApp } from '@/components/apps/creative/CreativeApp';
import { ContactApp } from '@/components/apps/contact/ContactApp';
import { TerminalApp } from '@/components/apps/terminal/TerminalApp';
import { SecretApp } from '@/components/apps/secret/SecretApp';
import type { AppId } from '@/types';

export const WindowManager: React.FC = () => {
  const { windows } = useOSStore();

  const renderAppContent = (appId: AppId) => {
    switch (appId) {
      case 'projects':
        return <ProjectsApp />;
      case 'about':
        return <AboutApp />;
      case 'lab':
        return <LabApp />;
      case 'skills':
        return <SkillsApp />;
      case 'creative':
        return <CreativeApp />;
      case 'contact':
        return <ContactApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'secret':
        return <SecretApp />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full pointer-events-none">
      {(Object.keys(windows) as AppId[]).map((appId) => {
        const config = APP_CONFIGS[appId];
        return (
          <div key={appId} className="pointer-events-auto">
            <Window id={appId} title={config.title}>
              {renderAppContent(appId)}
            </Window>
          </div>
        );
      })}
    </div>
  );
};

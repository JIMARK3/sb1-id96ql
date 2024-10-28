import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

export const Controls: React.FC = () => {
  return (
    <div className="mt-6">
      <h3 className="text-white text-sm mb-2">Controls</h3>
      <div className="grid grid-cols-2 gap-4 text-white text-sm">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Move Left
        </div>
        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> Move Right
        </div>
        <div className="flex items-center gap-2">
          <ArrowDown className="w-4 h-4" /> Move Down
        </div>
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4" /> Rotate
        </div>
      </div>
    </div>
  );
};
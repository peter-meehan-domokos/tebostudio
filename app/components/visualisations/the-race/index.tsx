'use client';
import { data } from './mockData';
import { Visual } from './visual/Visual';
export default function TheRace() {
  return (
    <div className="w-full h-full border-2 border-gray-300 rounded-lg p-8">
      <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-3xl text-[#1B2A49] mb-4">
        <Visual data={data} />
      </h1>
    </div>
  );
}

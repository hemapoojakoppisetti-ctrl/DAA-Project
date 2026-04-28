import React from 'react';
import { Award, Target, Eye, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="hero-gradient text-white rounded-2xl p-10 mb-10">
        <h1 className="font-display text-3xl font-bold mb-2">
          About DAA — Dynamic Academic Audits
        </h1>
        <p className="text-primary-200 text-lg">
          The official academic quality management system for JNTUK affiliated institutions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="card">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            About JNTUK
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Jawaharlal Nehru Technological University Kakinada (JNTUK) was established in 2008 by bifurcation of JNTU into three universities. It is one of the leading technological universities in Andhra Pradesh with over 700 affiliated colleges offering Engineering, MBA, MCA, Pharmacy and other programs.
          </p>
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            About DAA System
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Dynamic Academic Audits (DAA) is a comprehensive academic management and quality assurance system designed to streamline academic processes, maintain records, and ensure quality standards across all JNTUK affiliated institutions.
          </p>
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-500" />
            Vision
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            To be a globally recognized technological university that produces innovative, ethical, and socially responsible graduates who contribute to the technological advancement and economic development of the nation.
          </p>
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Mission
          </h2>
          <ul className="text-gray-600 text-sm space-y-2">
            {[
              'Provide quality technical education at affordable cost',
              'Foster research, innovation and entrepreneurship',
              'Promote industry-academia collaboration',
              'Ensure continuous improvement through academic audits',
              'Maintain highest standards of accreditation'
            ].map((m: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
          Accreditation & Recognition
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'NAAC Grade', value: 'A++', desc: 'National Assessment and Accreditation Council' },
            { label: 'NBA Accreditation', value: 'Yes', desc: 'National Board of Accreditation' },
            { label: 'Rank in AP', value: '#1', desc: 'Top Technological University in AP' },
            { label: 'Established', value: '2008', desc: 'Year of establishment' }
          ].map((item: { label: string; value: string; desc: string }, i: number) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-display font-bold text-primary-700">
                {item.value}
              </div>
              <div className="font-semibold text-gray-900 text-sm mt-1">
                {item.label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

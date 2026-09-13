import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Mail, Phone, MapPin, Clock, ShieldCheck, 
  Calculator, FileText, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { FuazLogo } from '../ui/FuazLogo';

export const UniversityFooterHelpdesk: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer id="university-footer-helpdesk" className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Main Footer Links & Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: University Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white rounded-lg inline-block">
                <FuazLogo size={42} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                  Federal University of Agriculture, Zuru
                </h4>
                <p className="text-[11px] text-emerald-400 font-semibold">
                  Motto: Knowledge, Agriculture & Innovation
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Established by the Federal Government of Nigeria to foster agricultural innovation, applied sciences, and national self-reliance through rigorous academic and research standards.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>P.M.B. 28, Zuru, Kebbi State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Academic Records: Mon – Fri (8:00 AM – 4:00 PM WAT)</span>
              </div>
            </div>
          </div>

          {/* Col 2: ICT & Academic Helpdesk */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> ICT & Records Support
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official contact channels for student registration errors, lecturer score submission inquiries, and examiner approval verifications.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">ICT Helpdesk:</span>
                <a href="mailto:ict-helpdesk@fuaz.edu.ng" className="text-white hover:text-emerald-300 font-medium hover:underline">
                  ict-helpdesk@fuaz.edu.ng
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Academic Affairs:</span>
                <a href="mailto:academic.records@fuaz.edu.ng" className="text-white hover:text-emerald-300 font-medium hover:underline">
                  records@fuaz.edu.ng
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Hotline:</span>
                <span className="text-white font-mono font-medium">+234 (0) 803 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Examinations Unit:</span>
                <span className="text-white font-mono font-medium">+234 (0) 814 987 6543</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Standards & Quick Portals */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Academic Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/gpa-guide')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official NUC 5.0 CGPA Computation Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=Student')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Student Result Checker & Transcript Slips</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=Lecturer')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lecturer Continuous Assessment Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=Chief%20Examiner')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Departmental Broadsheet Moderation Queue</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=Admin')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Course Management & Departmental Pools</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Security & Compliance */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Institutional Trust
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              FUAZ SRMS enforces National Universities Commission (NUC) benchmark standards with immutable audit logging across all semester grade calculations.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NUC 5-Point Scale Certified</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Verified weighted calculation: <span className="text-emerald-300 font-mono">CGPA = Total Quality Points ÷ Total Units</span>.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Portal Status: <strong className="text-slate-200">Online & Secure</strong></span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Version Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Federal University of Agriculture, Zuru. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Student Results Management System (SRMS)</span>
            <span>•</span>
            <span className="font-mono text-emerald-400">Release v2.4.0 (Enterprise)</span>
            <span>•</span>
            <button onClick={() => navigate('/gpa-guide')} className="hover:text-emerald-400 transition-colors">
              Grading Benchmark
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

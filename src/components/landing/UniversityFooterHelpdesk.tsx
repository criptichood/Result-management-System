import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Mail, Phone, MapPin, Clock, 
  Calculator, FileText, ArrowRight, Presentation 
} from 'lucide-react';
import { Button } from '../ui/button';
import { FuazLogo } from '../ui/FuazLogo';

export const UniversityFooterHelpdesk: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer id="university-footer-helpdesk" className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Col 1: University Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white rounded-lg inline-block">
                <FuazLogo size={40} />
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

            <div className="pt-1 space-y-1.5 text-xs text-slate-400">
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

          {/* Col 2: Official Support & Communications */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> Support & Inquiries
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Institutional contact channels for student course registration assistance, score submission support, and academic verifications.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">ICT Support:</span>
                <span className="text-slate-200 font-mono font-medium">***@fuaz.edu.ng</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Academic Affairs:</span>
                <span className="text-slate-200 font-mono font-medium">***@fuaz.edu.ng</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Support Line:</span>
                <span className="text-slate-200 font-mono font-medium">+234 (0) *** *** ****</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Examinations Unit:</span>
                <span className="text-slate-200 font-mono font-medium">+234 (0) *** *** ****</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Portals & Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Academic Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigate('/gpa-guide')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official NUC 5.0 CGPA Computation Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=Student')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Student Portal & Results</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=Lecturer')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lecturer Grading Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=Chief%20Examiner')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chief Examiner Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=Admin')}
                  className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium text-left cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>System Administration Portal</span>
                </button>
              </li>
              <li>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => navigate('/project-review')}
                    className="w-full justify-between bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 hover:text-white font-semibold text-xs py-2.5 px-3.5 rounded-xl shadow-xs cursor-pointer group transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Presentation className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>System Architecture & Review</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Clean Minimal Version */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 Federal University of Agriculture, Zuru. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>SRMS v1.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

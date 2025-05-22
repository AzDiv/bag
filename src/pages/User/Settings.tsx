import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Phone, Mail, User, Save, ExternalLink } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setWhatsapp(user?.whatsapp || '');
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    const result = await updateUserProfile({ name, email, whatsapp });
    setLoading(false);
    if (result.success) {
      toast.success('Profil mis à jour !');
    } else {
      toast.error(result.error || 'Échec de la mise à jour du profil');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Paramètres du compte</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">Informations personnelles</h2>
                <p className="text-sm text-gray-500">Mettez à jour vos informations de profil</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="input w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 disabled">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Adresse email
                  </label>
                  <input
                    type="email"
                    className="input w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    className="input w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="Entrez votre numéro WhatsApp"
                  />
                  <p className="text-xs text-gray-500">Format recommandé: +212661616161</p>
                </div>
                
                <div className="pt-4">
                  <button
                    className="btn btn-primary w-full sm:w-auto flex items-center justify-center"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">●</span>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Side Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">À propos</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                  <div className="p-4 bg-gray-50 rounded-md w-32 h-32 flex items-center justify-center">
                    <img 
                      src="/icon-logo.png" 
                      alt="Logo" 
                      className="max-w-full max-h-full"
                      onError={(e) => { 
                        e.currentTarget.src = 'https://via.placeholder.com/120?text=LOGO';
                      }}
                    />
                  </div>
                </div>
                
                {/* Brief Paragraph */}
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Bienvenue dans votre espace de gestion personnel. Ici, vous pouvez mettre à jour vos informations 
                    de contact et gérer vos préférences pour une meilleure expérience.
                  </p>
                </div>
                
                {/* WhatsApp Link */}
                <div className="pt-2">
                  <a
                  href="https://wa.me/message/VJI5TNRKIZ3VN1?src=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-3 px-5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl shadow hover:from-[#20BD5C] hover:to-[#0e6e5c] transition-all duration-200 w-full group"
                  >
                  <span className="flex items-center justify-center bg-white bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.996 0C5.372 0 0 5.367 0 11.992c0 2.625.846 5.051 2.285 7.024l-1.488 5.445 5.589-1.463c1.894 1.234 4.139 1.953 6.554 1.953 6.623 0 12.004-5.367 12.004-11.992C24.943 5.37 19.561 0 11.996 0zm0 21.883c-2.211 0-4.292-.6-6.073-1.644l-.436-.259-4.508 1.18 1.206-4.394-.285-.455A9.864 9.864 0 0 1 .105 11.992c0-5.478 4.463-9.939 9.943-9.939 5.478 0 9.941 4.461 9.941 9.939.002 5.48-4.461 9.941-9.993 9.891z" fillRule="evenodd"/>
                    </svg>
                  </span>
                  <span className="flex flex-col items-start">
                    <span className="font-semibold text-base">Besoin d'aide supplémentaire&nbsp;?</span>
                    <span className="text-xs text-white/80">Contactez-nous sur WhatsApp</span>
                  </span>
                  </a>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

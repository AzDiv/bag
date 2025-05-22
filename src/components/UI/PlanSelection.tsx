import React from 'react';
import { motion } from 'framer-motion';
import { Check, Award, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const PlanSelection: React.FC = () => {
  const { user, selectPlan } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const handleSelectPlan = async (packType: 'starter' | 'gold') => {
    setLoading(true);
    
    try {
      const { success, error } = await selectPlan(packType);
      
      if (success) {
        toast.success(`${packType.charAt(0).toUpperCase() + packType.slice(1)} sélectionné !`);
      } else {
        throw new Error(error);
      }
    } catch (error) {
      toast.error((error as Error).message || 'Échec de la sélection du plan');
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (packType: 'starter' | 'gold') => {
    return user?.pack_type === packType;
  };

  const plans = [
    {
      type: 'starter',
      name: 'Plan Starter',
      price: '5$',
      description: 'Parfait pour les débutants souhaitant démarrer leur parcours',
      features: [
        'Accès aux niveaux 10, 20, 30',
        'Vitesse de progression standard',
        'Outils d’invitation de base',
        'Support communautaire'
      ],
      icon: Zap,
      color: 'bg-primary',
      textColor: 'text-primary',
      borderColor: 'border-primary'
    },
    {
      type: 'gold',
      name: 'Plan Gold',
      price: '50$',
      description: 'Progression accélérée pour les membres sérieux',
      features: [
        'Accès aux niveaux 10-60',
        'Progression plus rapide',
        'Outils de groupe avancés',
        'Support prioritaire'
      ],
      icon: Award,
      color: 'bg-secondary',
      textColor: 'text-secondary-dark',
      borderColor: 'border-secondary'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary-dark mb-2">Choisissez Votre Plan</h2>
          <p className="mt-2 text-lg text-secondary-dark">
            Sélectionnez le plan qui correspond à vos objectifs et ambitions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const planType = plan.type as 'starter' | 'gold';
            const selected = isSelected(planType);
            return (
              <motion.div
                key={plan.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative p-8 rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-200 group bg-white hover:shadow-2xl ${
                  selected 
                    ? `${plan.borderColor}` 
                    : 'border-secondary-light'
                }`}
              >
                {selected && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-success text-white text-xs font-semibold shadow">
                      <Check className="h-4 w-4 mr-1" /> Actuel
                    </span>
                  </div>
                )}
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl ${plan.color} shadow-md group-hover:scale-110 transition-transform`}>
                    <plan.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="ml-4 text-2xl font-bold text-primary-dark group-hover:text-secondary transition-colors">{plan.name}</h3>
                </div>
                <p className={`mt-2 text-4xl font-extrabold ${plan.textColor}`}>{plan.price}</p>
                <p className="mt-2 text-base text-secondary-dark mb-4">{plan.description}</p>
                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-text-secondary">
                      <Check className="h-4 w-4 mr-2 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(planType)}
                  disabled={loading || selected}
                  className={`mt-8 w-full px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 shadow-md
                    ${selected
                      ? 'bg-secondary-light text-primary-dark cursor-default'
                      : `${plan.color} text-white hover:opacity-90 focus:ring-${plan.type === 'gold' ? 'secondary' : 'primary'}`
                    }`}
                >
                  {selected ? 'Plan Actuel' : 'Sélectionner le Plan'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {user?.pack_type && (
          <div className="bg-gradient-to-r from-secondary-light to-primary-light p-5 rounded-xl shadow flex flex-col items-center mt-8">
            <h3 className="font-bold text-primary-dark text-lg mb-1">Et après ?</h3>
            <p className="text-sm text-primary-dark mb-3 text-center max-w-xl">
              Pour activer votre plan, veuillez envoyer votre paiement via l’une des méthodes ci-dessous et soumettre une preuve.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a 
                href="https://wa.me/message/VJI5TNRKIZ3VN1?src=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn bg-[#25D366] text-white hover:bg-[#128C7E] focus:ring-success shadow"
              >
                Submit via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanSelection;
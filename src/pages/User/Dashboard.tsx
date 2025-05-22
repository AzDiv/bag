import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import PlanSelection from '../../components/UI/PlanSelection';
import ProgressStats from '../../components/UI/ProgressStats';
import GroupCard from '../../components/UI/GroupCard';
import ShareModal from '../../components/UI/ShareModal';
import JoinGroupModal from '../../components/UI/JoinGroupModal';
import { getUserWithGroups, joinGroupAsExistingUser } from '../../lib/supabase';
import { UserWithGroupDetails, Group } from '../../types/database.types';
import { AlertCircle, InfoIcon, CheckCircle, Link2, AlertTriangle } from 'lucide-react';
import PaymentInstructions from '../../components/UI/PaymentInstruction'; 

const Dashboard: React.FC = () => {
  const { user, refreshUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserWithGroupDetails | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedGroupCode, setSelectedGroupCode] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinError, setJoinError] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        const userData = await getUserWithGroups(user.id);
        setUserData(userData);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  useEffect(() => {
    // Remove or increase the interval duration
    // Or remove this effect entirely if not needed
    // const interval = setInterval(() => {
    //   refreshUser();
    // }, 60000); // every minute

    // return () => clearInterval(interval);
  }, [refreshUser]);
  
  const handleShareGroup = (groupCode: string) => {
    setSelectedGroupCode(groupCode);
    setShareModalOpen(true);
  };
  
  const handleJoinGroup = async (groupCode: string) => {
    setJoinError('');
    if (!user) return { success: false, error: 'Utilisateur non connecté.' };
    const result = await joinGroupAsExistingUser(user.id, groupCode);
    if (!result.success) setJoinError(result.error || 'Erreur inconnue');
    else {
      // Optionally refresh user data after joining
      await refreshUser();
      setTimeout(() => setShowJoinModal(false), 1200);
    }
    return result;
  };
  
  // Show plan selection if user hasn't selected a plan yet
  if (user && !user.pack_type) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Bienvenue sur Boom Bag !</h1>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Prochaine étape : choisissez votre plan
            </h2>
            <p className="text-gray-600 mb-6">
              Sélectionnez un plan adapté à vos objectifs pour continuer la configuration de votre compte.
            </p>
            <PlanSelection />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Show pending verification message if user has selected a plan but is not yet verified
  if (user && user.pack_type && user.status === 'pending') {
    return (
      <DashboardLayout>
        <div className="min-h-[calc(100vh-80px)] py-8 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-8"
          >
            {/* Section principale */}
            <div className="lg:col-span-4 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h1 className="text-xl font-bold text-gray-900">Vérification en cours</h1>
              </div>
              
              <div className="p-6">
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-yellow-100 rounded-full flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Votre compte est en attente de vérification
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Nous avons bien reçu votre sélection de plan et attendons la confirmation de votre paiement.
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-lg mb-6 border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                    <InfoIcon className="h-5 w-5 mr-2" />
                    Prochaines étapes:
                  </h3>
                  <ol className="list-decimal list-inside text-blue-700 space-y-3 pl-1">
                    <li className="pb-2 border-b border-blue-100">Envoyez votre paiement en utilisant l'une des méthodes ci-dessous</li>
                    <li className="pb-2 border-b border-blue-100">Soumettez une preuve de paiement via WhatsApp</li>
                    <li className="pb-2 border-b border-blue-100">Attendez la vérification de l'administrateur (généralement sous 24 heures)</li>
                    <li>Une fois vérifié, vous aurez accès à votre groupe et à toutes les fonctionnalités</li>
                  </ol>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <Link2 className="h-5 w-5 mr-2 text-gray-500" />
                    Contactez-nous pour finaliser votre inscription :
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="https://wa.me/+33780892557" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn bg-[#25D366] text-white hover:bg-[#128C7E] focus:ring-green-500 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Contacter via WhatsApp
                    </a>
                    
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section latérale avec instructions de paiement */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-20">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-800">Instructions de paiement</h2>
                </div>
                
                <div className="p-6">
                  <PaymentInstructions />
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                      <p className="text-sm text-yellow-700">
                        Après le paiement, envoyez une capture d'écran de votre preuve de paiement à notre équipe via WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Show main dashboard for verified users
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {userData && (
              <div className="space-y-6">
                
                {/* Groups */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Vos Groupes</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Gérez vos groupes et suivez leurs progrès
                    </p>
                  </div>
                  
                  <div className="px-6 py-5">
                    <div className="grid md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((groupNumber, idx) => {
                        const group = userData.groups?.find(g => g.group_number === groupNumber);
                        const packType = user?.pack_type || 'starter';
                        // Define levels and amounts
                        const starterAmounts = ['5$', '10$', '20$'];
                        const goldAmounts = ['$50', '$100', '$200'];
                        const isGold = packType === 'gold';
                        const amount = isGold ? goldAmounts[idx] : starterAmounts[idx];

                        if (group) {
                          // Show real group card, use group.members and group.verified_members
                          return (
                            <GroupCard
                              key={group.id}
                              group={group}
                              memberCount={group.members ?? 0}
                              verifiedCount={group.verified_members ?? 0}
                              onShareLink={handleShareGroup}
                              packType={packType}
                            />
                          );
                        } else {
                          // Show locked card
                          return (
                            <div
                              key={groupNumber}
                              className="bg-gray-100 rounded-xl shadow-md flex flex-col items-center justify-center p-8 opacity-60 relative"
                            >
                              <div className="absolute top-4 right-4 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V7a4 4 0 10-8 0v4M6 15v2a2 2 0 002 2h8a2 2 0 002-2v-2M6 15h12" />
                                </svg>
                              </div>
                              <div className="text-2xl font-bold text-gray-500 mb-2">Groupe Niveau {groupNumber}</div>
                              <div className="text-lg text-gray-400 mb-4">{amount}</div>
                              <div className="text-gray-400">Verrouillé</div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Progress Stats */}
                <ProgressStats user={userData} />

              </div>
            )}
          </>
        )}
        
        {/* Share Modal */}
        <ShareModal 
          groupCode={selectedGroupCode} 
          isOpen={shareModalOpen} 
          onClose={() => setShareModalOpen(false)} 
        />
        
        {/* Join Group Modal */}
        {showJoinModal && (
          <JoinGroupModal
            onClose={() => setShowJoinModal(false)}
            onJoin={handleJoinGroup}
            errorMessage={joinError}
          />
        )}
        
        {/* Add Join Group button for logged-in users */}

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
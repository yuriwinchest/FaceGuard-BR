import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-transparent p-4 backdrop-blur-md border-b border-white/5">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-start text-white/90">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">Política de Privacidade</h1>
        <div className="w-10"></div>
      </div>

      <main className="flex-1 px-4 pb-24 pt-6">
        <h1 className="mb-1 text-3xl font-bold">Política de Privacidade</h1>
        <p className="mb-6 text-sm text-white/50">Última atualização: 26 de Outubro de 2023</p>

        <div className="flex flex-col">
          {/* Introduction */}
          <details className="group border-t border-white/10">
            <summary className="flex cursor-pointer items-center justify-between py-4 font-medium list-none">
              <span>Introdução</span>
              <span className="material-symbols-outlined text-white/50 transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="pb-4 text-sm text-[#9db9a6] leading-relaxed">
              Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações ao utilizar nosso aplicativo de detecção e reconhecimento facial. Sua privacidade é importante para nós e estamos comprometidos em protegê-la.
            </div>
          </details>

          {/* Information We Collect */}
          <details className="group border-t border-white/10" open>
            <summary className="flex cursor-pointer items-center justify-between py-4 font-medium list-none">
              <span>Informações que Coletamos</span>
              <span className="material-symbols-outlined text-white/50 transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="pb-4 text-sm text-[#9db9a6] leading-relaxed">
              <p className="mb-2">Para fornecer nossos serviços, coletamos as seguintes informações:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Dados Faciais:</strong> Processamos dados de geometria facial, considerados <span className="text-primary font-bold">informações biométricas</span>, diretamente no seu dispositivo para permitir recursos de detecção e reconhecimento. Esses dados não saem do seu dispositivo.
                </li>
                <li>
                  <strong className="text-white">Acesso à Câmera:</strong> O aplicativo requer acesso à câmera do seu dispositivo para capturar imagens para processamento em tempo real.
                </li>
                <li>
                  <strong className="text-white">Dados de Uso:</strong> Podemos coletar dados anônimos sobre sua interação com o aplicativo (ex: uso de recursos, relatórios de falhas) para nos ajudar a melhorar o desempenho e a experiência do usuário.
                </li>
              </ul>
            </div>
          </details>

          {/* How We Use Your Information */}
          <details className="group border-t border-white/10">
            <summary className="flex cursor-pointer items-center justify-between py-4 font-medium list-none">
              <span>Como Usamos Suas Informações</span>
              <span className="material-symbols-outlined text-white/50 transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="pb-4 text-sm text-[#9db9a6] leading-relaxed">
              Suas informações são usadas exclusivamente para fornecer e melhorar a funcionalidade do aplicativo. Não usamos seus dados faciais para publicidade, marketing ou qualquer outro propósito além dos recursos principais do aplicativo.
            </div>
          </details>

          {/* Data Sharing */}
          <details className="group border-t border-white/10">
            <summary className="flex cursor-pointer items-center justify-between py-4 font-medium list-none">
              <span>Compartilhamento e Divulgação</span>
              <span className="material-symbols-outlined text-white/50 transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="pb-4 text-sm text-[#9db9a6] leading-relaxed">
              Não compartilhamos, vendemos ou divulgamos seus <strong className="text-white">dados faciais</strong> pessoais a terceiros. Todo o processamento facial ocorre localmente no seu dispositivo.
            </div>
          </details>

          {/* Contact */}
          <details className="group border-y border-white/10">
            <summary className="flex cursor-pointer items-center justify-between py-4 font-medium list-none">
              <span>Fale Conosco</span>
              <span className="material-symbols-outlined text-white/50 transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="pb-4 text-sm text-[#9db9a6] leading-relaxed">
              Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em <a href="#" className="text-primary underline">privacy@example.com</a>.
            </div>
          </details>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-background-dark/95 p-4 backdrop-blur-md w-full max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-background-dark transition-transform active:scale-95"
        >
          Aceitar & Continuar
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
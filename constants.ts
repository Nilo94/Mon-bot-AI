import { AgentDef, AgentId, Prospect } from './types';
import { v4 as uuidv4 } from 'uuid';

export const RAW_MAILING_LIST = [
  // Val de Marne
  { email: "courrier@mairie-alfortville.fr", org: "Mairie Alfortville", region: "Val de Marne", source: "Web Scraping" },
  { email: "recrutement@tech-agency.fr", org: "Tech Agency Paris", region: "Paris", source: "Indeed" },
  { email: "info@ville-boissy.fr", org: "Ville Boissy", region: "Val de Marne", source: "Web Scraping" },
  { email: "jobs@startup-flow.io", org: "Startup Flow", region: "Remote", source: "Indeed" },
  { email: "mairie@bry94.fr", org: "Mairie Bry", region: "Val de Marne", source: "Web Scraping" },
  { email: "talent@digital-impact.com", org: "Digital Impact", region: "Île-de-France", source: "Indeed" },
  { email: "courrier@choisyleroi.fr", org: "Choisy le Roi", region: "Val de Marne", source: "Web Scraping" },
  // Seine Saint Denis
  { email: "service.accueil.noiseens@ville-noisylegrand.fr", org: "Noisy le Grand", region: "Seine Saint Denis", source: "Web Scraping" },
  { email: "rh@ecom-solution.fr", org: "E-Com Solution", region: "Saint-Denis", source: "Indeed" },
  { email: "contact@mairie-neuillyplaisance.com", org: "Neuilly Plaisance", region: "Seine Saint Denis", source: "Web Scraping" },
];

export const INITIAL_CV = `
NOM: Colin
POSTE: Digital Marketing Junior

COMPÉTENCES:
- Marketing de base
- Réseaux sociaux (Facebook)
- Word, Excel
- Anglais scolaire

EXPÉRIENCE:
- Stage observation (1 semaine)
- Assistant vente (été 2023)
`;

export const AUTH_SCRIPT_CONTENT = `import os.path
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# Nous définissons les permissions (Scopes)
# Pour Indeed via Google, on demande l'accès au profil et à l'email
SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'openid']

def connexion_google():
    creds = None
    # Le fichier token.json stocke vos accès après la première connexion
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    # Si pas de credentials valides, on se connecte
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Charge le fichier téléchargé depuis la console Google Cloud
            flow = InstalledAppFlow.from_client_secrets_file(
                'client_secret.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Sauvegarde le token pour la prochaine fois
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    print("Connexion réussie pour le compte :", "colinorelus1998@gmail.com")
    return creds

if __name__ == '__main__':
    connexion_google()`;

export const AGENTS: Record<AgentId, AgentDef> = {
  [AgentId.A1_0]: {
    id: AgentId.A1_0,
    name: "Superviseur",
    role: "Orchestration",
    description: "Prise de décision, initialisation du flux et validation finale.",
    icon: "BrainCircuit"
  },
  [AgentId.A1_1]: {
    id: AgentId.A1_1,
    name: "Prospecteur",
    role: "Sourcing & Scraping",
    description: "Connecteur API Indeed, Scraping Web, Google Custom Search.",
    icon: "ScanSearch"
  },
  [AgentId.A1_2]: {
    id: AgentId.A1_2,
    name: "Rédacteur",
    role: "Génération de contenu",
    description: "Rédige des lettres de motivation et des emails personnalisés.",
    icon: "Feather"
  },
  [AgentId.A1_3]: {
    id: AgentId.A1_3,
    name: "Contrôleur QA",
    role: "Assurance Qualité",
    description: "Valide la syntaxe, le ton et la personnalisation.",
    icon: "ShieldCheck"
  },
  [AgentId.A1_4]: {
    id: AgentId.A1_4,
    name: "Optimiseur CV",
    role: "Optimisation",
    description: "Adapte le CV aux tendances du marché et aux offres spécifiques.",
    icon: "FileUp"
  },
  [AgentId.A1_5]: {
    id: AgentId.A1_5,
    name: "Analyste",
    role: "Reporting",
    description: "Consolide les données et génère les indicateurs clés (KPIs).",
    icon: "BarChart3"
  }
};
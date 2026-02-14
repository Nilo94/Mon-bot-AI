import os.path
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
            # Vérification de l'existence du fichier client_secret.json
            if not os.path.exists('client_secret.json'):
                print("Erreur: Le fichier 'client_secret.json' est introuvable.")
                print("Veuillez le télécharger depuis la console Google Cloud.")
                return None

            # Charge le fichier téléchargé depuis la console Google Cloud
            flow = InstalledAppFlow.from_client_secrets_file(
                'client_secret.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Sauvegarde le token pour la prochaine fois
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    # Affichage de confirmation avec l'email spécifié
    print("Connexion réussie pour le compte :", "colinorelus1998@gmail.com")
    return creds

if __name__ == '__main__':
    print("--- AutoProspect AI : Module d'authentification Indeed/Google ---")
    print("Assurez-vous d'avoir installé les dépendances :")
    print("pip install google-auth google-auth-oauthlib google-auth-httplib2 requests")
    print("-----------------------------------------------------------------")
    connexion_google()
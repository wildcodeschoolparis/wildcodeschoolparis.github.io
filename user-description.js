export const userDescription = {
  id: { type: 'internal' },
  deal: { type: 'internal' },
  questions: {
    type: 'divider',
    title: 'En savoir plus sur toi',
    text: 'Juste trois petites questions',
  },
  wildside: {
    type: 'ask',
    title: 'Ton côté wild ?',
    icon: 'paw'
  },
  travel: {
    type: 'ask',
    title: 'Tu mets combien de temps pour venir ?',
    icon: 'subway',
  },
  discovery: {
    type: 'ask',
    title: 'Comment as-tu découvert la programmation ?',
    icon: 'search'
  },
  accounts: {
    type: 'divider',
    title: 'Les comptes à créer',
    text: 'La Wild utilise diverses plateformes, tu peux créer ces 3 comptes tout seul',
  },
  gmail: {
    type: 'account',
    title: 'Compte Google',
    text: 'Requis pour l\'access au Google Drive et au Google Calendar',
    icon: 'google',
  },
  email: {
    type: 'account',
    title: 'Compte Odyssey',
    text: 'Odyssey sert à suivre vos quêtes et autre progression interne à la Wild.',
    icon: 'winner',
  },
  github: {
    type: 'account',
    title: 'Compte Github',
    text: 'Github est une plateforme de partage de code, gratuit pour l\'open source, votre profil Github est aujourd\'hui plus regardé que votre CV par les recruteurs',
    icon: 'github',
  },
  legal: {
    type: 'divider',
    title: 'Les Formalités',
    text: 'Toutes la paperasse à lire et à signer avec ton Campus Manager.',
  },
  rules: {
    type: 'sign',
    title: 'Règlement Intérieur',
    text: 'On en fait appel à votre bon sens, merci de respecter les autres et les locaux.',
    icon: 'book',
  },
  contract: {
    type: 'sign',
    title: 'Contrat de formation',
    text: 'Normalement y a pas trop de lignes, on a fait un effort.',
    icon: 'legal',
  },
  privacy: {
    type: 'sign',
    title: 'Autorisation de cession du droit à l\'image',
    text: 'Ta permission pour qu\'on ait pas besoin de pixeliser ton visage exquis lors des publications de la com.',
    icon: 'hide',
  },
  civil: {
    type: 'sign',
    title: 'Attestation Responsabilité Civile',
    text: 'À Wild, on assure :) :) :)',
    icon: 'law',
  },
  idcard: {
    type: 'hand',
    title: 'Carte d\'Identité',
    text: 'Vos papiers S.V.P',
    icon: 'id card',
  },
  invites: {
    type: 'divider',
    title: 'Les Invitations',
    text:
      <span>
        Normalement Édouard s'occupe d'inviter tout le monde sur les diverses
        plateformes.
        <br/>
        Si tu vois qu'il te manque des accès pense à bien vérifier tes emails.
      </span>,
  },
  trello: {
    type: 'invite',
    title: 'Trello de Bienvenue',
    text: 'Trello est un outil super simple de gestion de projets. Cette board contient toutes les infos nécessaires pour bien démarrer ton aventure',
    icon: 'trello'
  },
  chat: {
    type: 'ask',
    title:
      <a href='https://chat.wildcodeschool.fr/account/profile'>
        Nom d'Utilisateur Rocket Chat
      </a>,
    text: 'Une alternative OpenSource à Slack, outil de chat qui sert pour les discussions internes à la Wild. Gratuit et adaptable, grâce à lui nous sommes maîtres de nos données.',
    icon: 'chat'
  },
  feedback: {
    type: 'ask',
    title:
      <a href='http://feedback.wildcodeschool.fr/entry/register?Target=categories'>
        Compte Feedback
      </a>,
    text: 'Forum de feedback de la Wild, utile pour les suggestions et rapports de bugs',
    icon: 'leanpub'
  },
  drive: {
    type: 'invite',
    title: 'Drive partagé',
    text: 'Le drive est le centre de transit de tous les documents que te fournissent les formateurs. Tu y retrouveras les cours, sujets des projets, sujets des dojos etc...',
    icon: 'folder',
  },
  calendar: {
    type: 'invite',
    title: 'Calendar partagé',
    text: 'C\'est le planning de ta session, bien qu\'il soit susceptible d\'être changé, ça te donne les grandes lignes sur ce qui va suivre.',
    icon: 'calendar',
  },
  ghteam: {
    type: 'invite',
    title: 'Team Github',
    text: 'C\'est une invitation dans l\'organisation Github de l\'école qui te donne accès à du code privé.',
    icon: 'github alternate',
  },
  setup: {
    type: 'divider',
    title: 'Le Setup',
    text:
      <span>
        Assure-toi d'avoir ton ordi en ordre pour démarrer rapidement.
        <br/>
        Si tu n'as toujours pas d'ordi, demande à l'équipe de t'en fournir
        un contre caution (500€).
      </span>,
  },
  os: {
    type: 'install',
    title: 'Un system Unix (un linux ou macOS)',
    text: 'Désolé Bill Gates, sans rancune.',
    icon: 'linux',
  },
  editor: {
    type: 'install',
    title: 'Installer Sublime Text',
    text: 'Pour écrire ton code avec tout le confort d\'un éditeur moderne rapide et léger.',
    icon: 'file text',
  },
  browser: {
    type: 'install',
    title: 'Installer Chromium (ou Chrome)',
    text: 'Chrome regorge d\'outils et fonctionnalités pour débugger le JavaScript.',
    icon: 'world'
  },
}

const profilSteps = Object.entries(userDescription)
  .filter(([ key, { type } ]) => type !== 'divider' && type !== 'internal')
  .map(a => a[0])

export const calcProgress = ((f, total) => user => f(total, user))
  (new Function([ 'total', 'user' ], 'return ('+ profilSteps
    .map(key => `Boolean(user[${JSON.stringify(key)}])`)
    .join('+') + ')/total'), profilSteps.length)

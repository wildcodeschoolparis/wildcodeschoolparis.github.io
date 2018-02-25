export default {
  google: {
    clientId: '115429394411-gm0tkhph9s1hcre876r5gr39ajv38ac0.apps.googleusercontent.com',
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
      'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ],
    scope: [
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar',
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/drive',
    ],
  },
}

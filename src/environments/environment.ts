/**
 * Configuração de ambiente do MVC.
 *
 * `dataSource` decide qual implementação dos repositórios é injetada:
 *   - 'firebase' : lê/escreve no Firestore (projeto kyudan-da348). Requer seed.
 *   - 'mock'     : estado in-memory (roda 100% offline, sem rede).
 *
 * A config web do Firebase é pública por design — a segurança real vive nas
 * `firestore.rules`. Por isso pode ser versionada.
 */
export const environment = {
  production: false,
  dataSource: 'firebase' as 'firebase' | 'mock',
  firebase: {
    apiKey: 'AIzaSyDLJeOpwEeNIb0hJiuMl4RySWbltq1iynI',
    authDomain: 'kyudan-da348.firebaseapp.com',
    projectId: 'kyudan-da348',
    storageBucket: 'kyudan-da348.firebasestorage.app',
    messagingSenderId: '864003488957',
    appId: '1:864003488957:web:9e47e3852306369db34bd4',
    measurementId: 'G-5VZRCS7B6N',
  },
};

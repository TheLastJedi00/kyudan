import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * MVC renderiza no cliente: as telas dependem do Firestore (dados por usuário),
 * então não faz sentido pré-renderizar no build. O SSR entrega o shell e o
 * cliente hidrata + busca os dados.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];

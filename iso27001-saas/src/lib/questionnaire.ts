export type QuestionnaireAnswerValue = 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'NOT_APPLICABLE';

export type QuestionnaireItem = {
  id: string;
  domain: string;
  personLabel: string;
  companyLabel: string;
};

export const ANSWER_OPTIONS: { value: QuestionnaireAnswerValue; label: string; points: number }[] = [
  { value: 'COMPLIANT', label: 'Conforme', points: 2 },
  { value: 'PARTIAL', label: 'Partiellement conforme', points: 1 },
  { value: 'NON_COMPLIANT', label: 'Non conforme', points: 0 },
  { value: 'NOT_APPLICABLE', label: 'Non applicable', points: 2 },
];

export const QUESTIONNAIRE_ITEMS: QuestionnaireItem[] = [
  {
    id: 'policy',
    domain: 'A.5 - Politiques de sécurité',
    personLabel: "Je connais et sais rédiger une politique de sécurité de l'information conforme à l'ISO 27001.",
    companyLabel: "L'organisation dispose d'une politique de sécurité de l'information approuvée par la direction.",
  },
  {
    id: 'org',
    domain: 'A.5 - Organisation de la sécurité',
    personLabel: 'Je sais définir les rôles et responsabilités liés à la sécurité de l\'information.',
    companyLabel: 'Les rôles et responsabilités en matière de sécurité sont clairement définis et attribués.',
  },
  {
    id: 'hr',
    domain: 'A.6 - Sécurité liée aux ressources humaines',
    personLabel: "Je maîtrise les exigences de sécurité à appliquer avant, pendant et après l'emploi.",
    companyLabel: 'Des vérifications et sensibilisations sécurité sont menées avant, pendant et après l\'emploi.',
  },
  {
    id: 'asset',
    domain: 'A.5/A.8 - Gestion des actifs',
    personLabel: 'Je sais réaliser un inventaire des actifs informationnels et leur classification.',
    companyLabel: 'Un inventaire des actifs informationnels est maintenu et classifié selon sa sensibilité.',
  },
  {
    id: 'access',
    domain: 'A.5/A.8 - Contrôle d\'accès',
    personLabel: 'Je maîtrise les principes de gestion des accès (moindre privilège, revue des droits).',
    companyLabel: 'Une politique de contrôle d\'accès basée sur le moindre privilège est en place et revue périodiquement.',
  },
  {
    id: 'crypto',
    domain: 'A.8 - Cryptographie',
    personLabel: 'Je sais définir et appliquer une politique d\'usage de la cryptographie.',
    companyLabel: 'Une politique d\'utilisation des contrôles cryptographiques est définie et appliquée.',
  },
  {
    id: 'physical',
    domain: 'A.7 - Sécurité physique et environnementale',
    personLabel: 'Je sais évaluer les mesures de sécurité physique des locaux et équipements.',
    companyLabel: 'Les locaux et équipements sensibles sont protégés par des mesures physiques adaptées.',
  },
  {
    id: 'ops',
    domain: 'A.8 - Sécurité liée à l\'exploitation',
    personLabel: 'Je maîtrise la gestion des changements, capacités et protections contre les malwares.',
    companyLabel: 'Les procédures d\'exploitation (changements, sauvegardes, anti-malware) sont documentées et suivies.',
  },
  {
    id: 'comms',
    domain: 'A.8 - Sécurité des communications',
    personLabel: 'Je sais sécuriser les échanges d\'information et les réseaux.',
    companyLabel: 'Les réseaux et transferts d\'information sont protégés et surveillés.',
  },
  {
    id: 'dev',
    domain: 'A.8 - Acquisition, développement et maintenance',
    personLabel: 'Je maîtrise l\'intégration de la sécurité dans le cycle de développement logiciel.',
    companyLabel: 'La sécurité est intégrée dans le cycle de développement et de maintenance des systèmes.',
  },
  {
    id: 'supplier',
    domain: 'A.5 - Relations avec les fournisseurs',
    personLabel: 'Je sais évaluer les risques de sécurité liés aux fournisseurs et sous-traitants.',
    companyLabel: 'Les risques de sécurité liés aux fournisseurs sont évalués et contractualisés.',
  },
  {
    id: 'incident',
    domain: 'A.5 - Gestion des incidents',
    personLabel: 'Je maîtrise un processus de gestion des incidents de sécurité (détection, réponse, retour d\'expérience).',
    companyLabel: 'Un processus de gestion des incidents de sécurité est en place et testé.',
  },
  {
    id: 'continuity',
    domain: 'A.5 - Continuité d\'activité',
    personLabel: 'Je sais intégrer la sécurité de l\'information dans un plan de continuité d\'activité.',
    companyLabel: 'La continuité de la sécurité de l\'information est planifiée et testée régulièrement.',
  },
  {
    id: 'compliance',
    domain: 'A.5 - Conformité',
    personLabel: 'Je connais les exigences légales, réglementaires et contractuelles applicables.',
    companyLabel: 'Les exigences légales, réglementaires et contractuelles sont identifiées et respectées.',
  },
];

export function computeScore(answers: Record<string, QuestionnaireAnswerValue>): { score: number; max: number; percentage: number } {
  let score = 0;
  const max = QUESTIONNAIRE_ITEMS.length * 2;
  for (const item of QUESTIONNAIRE_ITEMS) {
    const value = answers[item.id];
    const option = ANSWER_OPTIONS.find((o) => o.value === value);
    if (option) score += option.points;
  }
  return { score, max, percentage: max === 0 ? 0 : Math.round((score / max) * 100) };
}

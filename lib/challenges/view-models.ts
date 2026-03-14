import {
  getChallengeDifficultyMetadata,
  getChallengeLanguageMetadata,
  getChallengePointBreakdown,
  getChallengeSourceMetadata,
  getChallengeStatusMetadata,
  getSubmissionStatusMetadata,
} from "@/lib/config/challenges";
import type {
  ChallengeRecord,
  SubmissionRecord,
} from "@/types/domain";

export type ChallengeViewModel = {
  difficultyLabel: string;
  languageLabel: string;
  sourceDescription: string;
  sourceLabel: string;
  sourceTone: "success" | "warning";
  statusLabel: string;
  estimatedMinutesLabel: string;
  issueLabel: string;
  pointsLabel: string;
  rewardBreakdownLabel: string;
  rewardPointsLabel: string;
  completionPointsLabel: string;
  scoreTierLabel: string;
  totalPointsLabel: string;
};

export type ChallengeDetailViewModel = ChallengeViewModel & {
  approachGuidance: string;
  approachSteps: string[];
  beforeStartChecklist: string[];
  skillTags: string[];
};

export type SubmissionViewModel = {
  statusLabel: string;
  statusTone: "muted" | "accent" | "success" | "warning";
};

export function buildChallengeViewModel(
  challenge: ChallengeRecord,
): ChallengeViewModel {
  const difficultyMetadata = getChallengeDifficultyMetadata(
    challenge.difficulty,
  );
  const languageMetadata = getChallengeLanguageMetadata(
    challenge.repository.language,
  );
  const sourceMetadata = getChallengeSourceMetadata(challenge.source);
  const statusMetadata = getChallengeStatusMetadata(challenge.status);
  const points = getChallengePointBreakdown(challenge.difficulty, challenge.points);

  return {
    difficultyLabel: difficultyMetadata.label,
    languageLabel: languageMetadata.label,
    sourceDescription: sourceMetadata.description,
    sourceLabel: sourceMetadata.label,
    sourceTone: sourceMetadata.badgeTone,
    statusLabel: statusMetadata.label,
    estimatedMinutesLabel: `${challenge.estimatedMinutes} min`,
    issueLabel: `#${challenge.issueNumber}`,
    pointsLabel: `${points.totalPoints} pts`,
    rewardBreakdownLabel: `${points.rewardPoints} reward + ${points.completionPoints} completion`,
    rewardPointsLabel: `${points.rewardPoints} pts`,
    completionPointsLabel: `${points.completionPoints} pts`,
    scoreTierLabel: points.scoreTierLabel,
    totalPointsLabel: `${points.totalPoints} pts`,
  };
}

export function buildChallengeDetailViewModel(
  challenge: ChallengeRecord,
): ChallengeDetailViewModel {
  const baseViewModel = buildChallengeViewModel(challenge);
  const skillTags = Array.from(
    new Set(
      [challenge.repository.language, ...challenge.techStack].filter(
        (value) => value.trim().length > 0,
      ),
    ),
  );
  const approachSteps =
    challenge.workflowSteps.length > 0
      ? challenge.workflowSteps
      : [
          "Reproduce or understand the reported issue before editing any code.",
          "Inspect the most likely files, tests, or docs surfaces in the repository.",
          "Write down the validation path before converting the plan into a patch.",
        ];
  const firstAcceptanceCriteria = challenge.acceptanceCriteria[0];

  return {
    ...baseViewModel,
    skillTags,
    approachGuidance: `Treat this as a ${baseViewModel.difficultyLabel.toLowerCase()} issue with a ${baseViewModel.scoreTierLabel.toLowerCase()} reward profile. Keep the first pass narrow, locate the exact code or docs surface involved, and define how the fix should be validated before implementation starts.`,
    approachSteps,
    beforeStartChecklist: [
      "Read the full issue thread and capture the exact user-facing problem.",
      `Inspect ${challenge.repository.fullName} for nearby patterns, tests, and contribution conventions.`,
      firstAcceptanceCriteria
        ? `Write down the first success condition: ${firstAcceptanceCriteria}`
        : "Decide what result will prove the fix is correct before you touch code.",
      "List any open questions, risky edge cases, or missing context before starting implementation.",
    ],
  };
}

export function buildSubmissionViewModel(
  submission: SubmissionRecord,
): SubmissionViewModel {
  const statusMetadata = getSubmissionStatusMetadata(submission.status);

  return {
    statusLabel: statusMetadata.label,
    statusTone: statusMetadata.badgeTone,
  };
}

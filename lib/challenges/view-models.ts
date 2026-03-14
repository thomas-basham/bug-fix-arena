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

export function buildSubmissionViewModel(
  submission: SubmissionRecord,
): SubmissionViewModel {
  const statusMetadata = getSubmissionStatusMetadata(submission.status);

  return {
    statusLabel: statusMetadata.label,
    statusTone: statusMetadata.badgeTone,
  };
}

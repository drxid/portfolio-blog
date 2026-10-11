import type { CvExperience } from '~/composables/useCvData'

/** id пункта опыта на странице /cv — по нему таймлайн скроллит к описанию */
export function experienceId(exp: CvExperience) {
  return `exp-${exp.start}`
}

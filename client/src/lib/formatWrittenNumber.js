import i18n from 'i18n';
/**
 * Format a given for written english - number that is less than 10 should be written words.
 *
 * @param  {Int} num
 * @return {String | Null}
 */
export default function formatWrittenNumber(num) {
  const parsed = Number(num);
  if (num !== null && parsed >= 0 && parsed < 10) {
    return [
      i18n._t('Admin.WRITTEN_NUMBER_ZERO', 'zero'),
      i18n._t('Admin.WRITTEN_NUMBER_ONE', 'one'),
      i18n._t('Admin.WRITTEN_NUMBER_TWO', 'two'),
      i18n._t('Admin.WRITTEN_NUMBER_THREE', 'three'),
      i18n._t('Admin.WRITTEN_NUMBER_FOUR', 'four'),
      i18n._t('Admin.WRITTEN_NUMBER_FIVE', 'five'),
      i18n._t('Admin.WRITTEN_NUMBER_SIX', 'six'),
      i18n._t('Admin.WRITTEN_NUMBER_SEVEN', 'seven'),
      i18n._t('Admin.WRITTEN_NUMBER_EIGHT', 'eight'),
      i18n._t('Admin.WRITTEN_NUMBER_NINE', 'nine'),
    ][parsed];
  } else if (parsed) {
    return String(parsed);
  }

  return null;
}

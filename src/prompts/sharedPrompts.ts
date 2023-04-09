import inquirer from 'inquirer'

/**
 * Displays a confirmation prompt to the user and returns their response.
 *
 * @async
 * @param {string} [message='Do you wish to continue?'] The message to display to the user in the prompt.
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the user wishes to continue or not.
*/
export async function confirmationPrompt (
  message: string = 'Do you wish to continue?'
): Promise<boolean> {
  const { isContinue } = await inquirer.prompt({
    type: 'confirm',
    name: 'isContinue',
    message
  })

  return isContinue
}

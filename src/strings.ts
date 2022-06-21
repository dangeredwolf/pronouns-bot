import { Constants } from './constants';

export const Strings = {
  PROMPT_MISSING_PERMISSION: `❌ I don't have permission to create a prompt in this channel. Please ensure that I have permission to View Channel, Send Message, and Embed Links`,
  PROMPT_MISSING_ACCESS: `❌ I don't have permission to create a prompt in this server. Please ensure that I have permission to View Channel, Send Message, and Embed Links`,
  PROMPT_UNKNOWN_ERROR: `❌ I couldn't create the pronoun picker message for you ({error}). Please try again later.`,
  PROMPT_SUCCESS: `✅ I successfully created the pronoun picker message for you.`,

  PROMPT_DEFAULT_TITLE: `👋 Hi, I can set pronouns for you`,
  PROMPT_DEFAULT_SUBTITLE: `Setting your pronouns lets everyone on the server know how to address you.`,

  GUILD_COMMAND_REGISTER_SUCCESS: `✅ Re-registered guild commands`,
  GUILD_COMMAND_REGISTER_FAIL: `❌ Failed to re-register guild commands: {error}`,
  GLOBAL_COMMAND_REGISTER_SUCCESS: `✅ Re-registered global commands`,
  GLOBAL_COMMAND_REGISTER_FAIL: `❌ Failed to re-register global commands: {error}`,

  LIST_ROLES_RESULT: `Here are the roles I know about:\n\n{roles}\n\nAny deleted or missing roles? Use **/set_pronouns_role** to configure existing roles with this bot or **/create_roles** to create new roles.`,
  LIST_ROLE_ENTRY: `{pronoun}: <@&{role_id}>`,

  CREATE_ROLES_SUCCESS: `✅ I created pronoun roles for {pronounList}`,
  CREATE_ROLES_FAIL: `❌ I couldn't create some roles ({error}). Please try again in a little bit. If this is your server, make sure the bot has the Manage Roles permission.`,
  CREATE_ROLES_ALREADY_DONE: `✅ All the necessary roles have been created already.`,

  SET_ROLE_SUCCESS: `✅ Role for pronoun {pronoun} set to <@&{role_id}>`,

  ROLE_ADD_SUCCESS: `✅ You've added the **{pronoun}** pronoun role. You can pick more pronouns if you'd like!`,
  ROLE_ADD_FAIL: `❌ An error occurred while adding the role ({error}). Please try again in a little bit.`,
  ROLE_REMOVE_SUCCESS: `✅ You no longer have the **{pronoun}** pronoun role.`,
  ROLE_REMOVE_FAIL: `❌ An error occurred while removing the role ({error}). Please try again in a little bit.`,
  ROLE_NOT_CONFIGURED: `❌ This pronoun hasn't been configured yet. If you manage this server, use the **/set_role** command to add existing pronoun roles to the bot or **/create_roles** to create new roles.\n\nView full docs at ${Constants.DOCS_URL}`,
  ROLE_NO_PERMISSION: `❌ I don't have permission to manage roles. Please give me the Manage Roles permission so I can work.`,

  GENERIC_GUILD_MISSING: `You can only use this command in a server.`,
  MISSING_FIELD: `❌ Missing required parameter: {field}`,
  INVALID_FIELD: `❌ Invalid parameter for {field}`,

  CUSTOM_ROLE_SUCCESS: `✅ Custom pronoun role set for {pronoun}`,
  CUSTOM_ROLE_IS_DEFAULT: `❌ Can't create a custom pronoun with the same name as a default pronoun. If you disabled it then re-enable it using **/enable_default_pronoun**`,
  CUSTOM_ROLE_EXISTS: `Pronoun role already exists for {pronoun}`,
  CUSTOM_ROLE_FAIL: `❌ An error occurred while setting the custom role ({error}). Please try again in a little bit.`,

  VERSION_INFO: `Pronouns Bot by dangered wolf#3621 <@284144747860459532>, build ${_COMMIT_HASH} (${_BUILD_DATE})`,
  COMMAND_NOT_FOUND: `❌ Unknown command: {command}`,
  UNKNOWN_COMMAND_ERROR: `❌ An unknown error occurred while processing your command. If you see this, please ping \`dangered wolf#3621\` <@284144747860459532>\n\n{error}`,
};

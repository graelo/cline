import { mistralModels } from "@shared/api"
import { Mode } from "@shared/storage/types"
import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { ApiKeyField } from "../common/ApiKeyField"
import { ModelInfoView } from "../common/ModelInfoView"
import { DropdownContainer, ModelSelector } from "../common/ModelSelector"
import { normalizeApiConfiguration } from "../utils/providerUtils"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"

/**
 * Props for the MistralProvider component
 */
interface MistralProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

/**
 * The Mistral provider configuration component
 */
export const MistralProvider = ({ showModelOptions, isPopup, currentMode }: MistralProviderProps) => {
	const { apiConfiguration } = useExtensionState()
	const { handleFieldChange, handleModeFieldChange } = useApiConfigurationHandlers()

	// Get the normalized configuration
	const { selectedModelId, selectedModelInfo } = normalizeApiConfiguration(apiConfiguration, currentMode)

	return (
		<div>
			<DropdownContainer className="dropdown-container" style={{ position: "inherit" }}>
				<label htmlFor="mistralai-entrypoint">
					<span style={{ fontWeight: 500, marginTop: 5 }}>Mistral AI Entrypoint</span>
				</label>
				<VSCodeDropdown
					id="mistralai-entrypoint"
					onChange={(e) => handleFieldChange("mistralApiLine", (e.target as any).value)}
					style={{
						minWidth: 130,
						position: "relative",
					}}
					value={apiConfiguration?.mistralApiLine || "main"}>
					<VSCodeOption value="main">https://api.mistral.ai/v1</VSCodeOption>
					<VSCodeOption value="codestral">https://codestral.mistral.ai/v1</VSCodeOption>
				</VSCodeDropdown>
			</DropdownContainer>
			<p
				style={{
					fontSize: "12px",
					marginTop: 3,
					color: "var(--vscode-descriptionForeground)",
				}}>
				Please select the appropriate API entrypoint based on your location. If you are using Codestral, you might have to
				choose the Codestral endpoint. Otherwise, choose the main endpoint.
			</p>

			<ApiKeyField
				initialValue={apiConfiguration?.mistralApiKey || ""}
				onChange={(value) => handleFieldChange("mistralApiKey", value)}
				providerName="Mistral"
				signupUrl="https://console.mistral.ai/codestral"
			/>

			{showModelOptions && (
				<>
					<ModelSelector
						label="Model"
						models={mistralModels}
						onChange={(e: any) =>
							handleModeFieldChange(
								{ plan: "planModeApiModelId", act: "actModeApiModelId" },
								e.target.value,
								currentMode,
							)
						}
						selectedModelId={selectedModelId}
					/>

					<ModelInfoView isPopup={isPopup} modelInfo={selectedModelInfo} selectedModelId={selectedModelId} />
				</>
			)}
		</div>
	)
}

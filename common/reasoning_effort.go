package common

import "strings"

// NormalizeReasoningEffortForLog returns a concrete provider value or an
// empty string when the request did not use a reasoning effort.
func NormalizeReasoningEffortForLog(value string) string {
	value = strings.TrimSpace(value)
	switch strings.ToLower(value) {
	case "", "none", "unknown", "normal", "default":
		return ""
	default:
		return value
	}
}

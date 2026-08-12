package common

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNormalizeReasoningEffortForLog(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{name: "preserves official value", input: " high ", want: "high"},
		{name: "preserves provider-specific value", input: "XHigh", want: "XHigh"},
		{name: "empty is absent", input: "", want: ""},
		{name: "sentinel none is absent", input: "NONE", want: ""},
		{name: "sentinel unknown is absent", input: "unknown", want: ""},
		{name: "sentinel normal is absent", input: "normal", want: ""},
		{name: "sentinel default is absent", input: "default", want: ""},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, NormalizeReasoningEffortForLog(tt.input))
		})
	}
}

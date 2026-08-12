package model

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReasoningEffortFromLogOther(t *testing.T) {
	tests := []struct {
		name     string
		other    map[string]interface{}
		want     string
		hasValue bool
	}{
		{name: "official value", other: map[string]interface{}{"reasoning_effort": " high "}, want: "high", hasValue: true},
		{name: "provider value", other: map[string]interface{}{"reasoning_effort": "some-official-value"}, want: "some-official-value", hasValue: true},
		{name: "none is null", other: map[string]interface{}{"reasoning_effort": "none"}},
		{name: "missing is null", other: map[string]interface{}{}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := reasoningEffortFromLogOther(tt.other)
			if !tt.hasValue {
				assert.Nil(t, got)
				return
			}
			if assert.NotNil(t, got) {
				assert.Equal(t, tt.want, *got)
			}
		})
	}
}

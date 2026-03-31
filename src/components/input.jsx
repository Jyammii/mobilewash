import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

export const Input = ({ 
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  showPasswordToggle,
  keyboardType = 'default',
  maxLength,
  multiline,
  numberOfLines,
  editable = true,
  prefix,
  suffix,
  style,
  inputStyle,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        { borderColor: getBorderColor() },
        isFocused && styles.focused,
        error && styles.errorBorder,
        !editable && styles.disabled
      ]}>
        {prefix && <View style={styles.prefix}>{prefix}</View>}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            prefix && styles.inputWithPrefix,
            suffix && styles.inputWithSuffix,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {suffix && <View style={styles.suffix}>{suffix}</View>}
        
        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsSecure(!isSecure)}
          >
            <Text style={styles.eyeIconText}>
              {isSecure ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 14,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputWithPrefix: {
    paddingLeft: 8,
  },
  inputWithSuffix: {
    paddingRight: 8,
  },
  prefix: {
    marginRight: 4,
  },
  suffix: {
    marginLeft: 4,
  },
  focused: {
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.backgroundDark,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  eyeIcon: {
    padding: 8,
  },
  eyeIconText: {
    fontSize: 18,
  },
});

export default Input;

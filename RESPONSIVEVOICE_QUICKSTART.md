# ResponsiveVoice.js Quick Start Guide

## TL;DR - Working Implementation

If you just need to get ResponsiveVoice working quickly, here's the exact code that works:

### 1. HTML Setup
```html
<!-- Load ResponsiveVoice CDN -->
<script src="https://code.responsivevoice.org/responsivevoice.js"></script>
<script>
window.addEventListener('load', function() {
  const checkResponsiveVoice = () => {
    if (typeof responsiveVoice !== 'undefined' && responsiveVoice.voiceSupport) {
      console.log('✅ ResponsiveVoice ready');
      
      // Test it works
      responsiveVoice.speak('Test successful', null, {
        onstart: () => console.log('✅ Working!'),
        onend: () => console.log('✅ Complete!')
      });
      
      return true;
    }
    return false;
  };
  
  // Keep checking until loaded
  if (!checkResponsiveVoice()) {
    const interval = setInterval(() => {
      if (checkResponsiveVoice()) clearInterval(interval);
    }, 100);
  }
});
</script>
```

### 2. JavaScript Usage
```javascript
// Simple speak function
function speak(text) {
  if (window.responsiveVoice) {
    responsiveVoice.speak(text, null, {
      onstart: () => console.log('Speech started'),
      onend: () => console.log('Speech ended'),
      onerror: (err) => console.log('Error:', err)
    });
  }
}

// Control functions
function pauseSpeech() {
  if (window.responsiveVoice) {
    responsiveVoice.pause();
  }
}

function resumeSpeech() {
  if (window.responsiveVoice) {
    responsiveVoice.resume();
  }
}

function stopSpeech() {
  if (window.responsiveVoice) {
    responsiveVoice.cancel();
  }
}
```

### 3. Usage Examples
```javascript
// Basic usage
speak("Hello world, this is ResponsiveVoice working!");

// With callbacks
responsiveVoice.speak("This text will be spoken", null, {
  onstart: function() {
    console.log("Speech started");
  },
  onend: function() {
    console.log("Speech completed");
  },
  onerror: function(error) {
    console.log("Speech error:", error);
  }
});
```

## Critical Rules

### ✅ DO THIS:
- Load from `https://code.responsivevoice.org/responsivevoice.js`
- Use `null` as the voice parameter
- Wait for `responsiveVoice.voiceSupport()` to be available
- Keep function calls simple
- Use for non-commercial projects

### ❌ DON'T DO THIS:
- Don't add API key parameters
- Don't specify voice names (use `null`)
- Don't add rate/pitch/volume parameters
- Don't try to override or intercept calls
- Don't use for commercial projects without license

## Expected Behavior

### What You'll Get:
- **Voice**: Browser's default voice (usually Google UK English Female)
- **Quality**: High-quality speech synthesis
- **Reliability**: Stable playback without truncation
- **Compatibility**: Works across modern browsers

### What You Won't Get:
- Multiple voice options
- Voice customization (rate, pitch, volume)
- Premium features
- Commercial usage rights

## Common Issues & Solutions

### Issue: "ResponsiveVoice missing API key"
**Solution**: You're using premium features. Stick to `null` voice parameter.

### Issue: No sound output
**Solution**: Check browser permissions and try: `responsiveVoice.speak('test', null)`

### Issue: 403 Forbidden errors
**Solution**: Remove any voice names or complex parameters.

### Issue: Speech stops mid-sentence
**Solution**: Don't chunk text, pass the full text in one call.

## React Integration Example

```jsx
import React, { useState, useEffect } from 'react';

const VoiceComponent = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      if (window.responsiveVoice && window.responsiveVoice.voiceSupport) {
        setIsReady(true);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  }, []);

  const speak = () => {
    if (!isReady || !text) return;
    
    setIsPlaying(true);
    window.responsiveVoice.speak(text, null, {
      onstart: () => setIsPlaying(true),
      onend: () => setIsPlaying(false),
      onerror: () => setIsPlaying(false)
    });
  };

  const stop = () => {
    window.responsiveVoice.cancel();
    setIsPlaying(false);
  };

  if (!isReady) return <div>Loading voice...</div>;

  return (
    <div>
      <button onClick={speak} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play'}
      </button>
      <button onClick={stop} disabled={!isPlaying}>
        Stop
      </button>
    </div>
  );
};
```

## Testing Checklist

Before deploying, verify:

- [ ] ResponsiveVoice loads without errors
- [ ] Console shows "✅ ResponsiveVoice ready" 
- [ ] Test speech works: `responsiveVoice.speak('test', null)`
- [ ] No 403 errors in Network tab
- [ ] Speech completes full text without truncation
- [ ] Pause/resume/cancel functions work
- [ ] Works in target browsers (Chrome, Firefox, Safari, Edge)

## License Reminder

ResponsiveVoice is **FREE for non-commercial use only**. For commercial projects, you need to purchase a license from https://responsivevoice.org/

---

**This guide represents the working solution as of January 2025.**
import { StyledContents, StyledWebBrowser } from "./styles";

interface WebBrowserProps {}

// eslint-disable-next-line no-empty-pattern
function WebBrowser({}: WebBrowserProps) {
  return (
    <StyledWebBrowser>
      <StyledContents src="https://example.com" />
    </StyledWebBrowser>
  );
}

export default WebBrowser;

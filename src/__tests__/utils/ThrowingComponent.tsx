import { Component } from 'react';

interface ThrowingComponentProps {
  shouldThrow: boolean;
}

class ThrowingComponent extends Component<ThrowingComponentProps> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('Test error from ThrowingComponent');
    }
    return <div>Normal Child Content</div>;
  }
}
export default ThrowingComponent;

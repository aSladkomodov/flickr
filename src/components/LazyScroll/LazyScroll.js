import React, { PureComponent } from "react";
import { throttle } from "throttle-debounce";
import { ThresholdUnits, parseThreshold } from "./helpers";

export default class InfiniteScroll extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showLoader: false,
      pullToRefreshThresholdBreached: false,
    };

    this.throttledOnScrollListener = throttle(150, this.onScrollListener).bind(
      this
    );
    this.errorSubmit = this.errorSubmit.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.lastScrollTop = 0;
    this.actionTriggered = false;
    this.startY = 0;
    this.currentY = 0;
    this.dragging = false;
    this.maxPullDownDistance = 0;
  }

  componentDidMount() {
    if (typeof this.props.dataLength === "undefined") {
      throw new Error(
        `mandatory prop "dataLength" is missing. The prop is needed` +
          ` when loading more content. Check README.md for usage`
      );
    }

    this.el = window;

    if (
      typeof this.props.initialScrollY === "number" &&
      this.el &&
      this.el instanceof HTMLElement &&
      this.el.scrollHeight > this.props.initialScrollY
    ) {
      this.el.scrollTo(0, this.props.initialScrollY);
    }

    if (this.el) {
      this.el.addEventListener("scroll", this.throttledOnScrollListener);
    }
  }

  componentWillUnmount() {
    if (this.el) {
      this.el.removeEventListener("scroll", this.throttledOnScrollListener);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataLength === prevProps.dataLength) return;

    this.actionTriggered = false;
    // update state when new data was sent in
    this.setState({
      showLoader: false,
    });
  }

  onStart = (evt) => {
    if (this.lastScrollTop) return;

    this.dragging = true;

    if (evt instanceof MouseEvent) {
      this.startY = evt.pageY;
    } else if (evt instanceof TouchEvent) {
      this.startY = evt.touches[0].pageY;
    }
    this.currentY = this.startY;

    if (this._infScroll) {
      this._infScroll.style.willChange = "transform";
      this._infScroll.style.transition = `transform 0.2s cubic-bezier(0,0,0.31,1)`;
    }
  };

  onMove = (evt) => {
    if (!this.dragging) return;

    if (evt instanceof MouseEvent) {
      this.currentY = evt.pageY;
    } else if (evt instanceof TouchEvent) {
      this.currentY = evt.touches[0].pageY;
    }

    if (this.currentY < this.startY) return;

    if (
      this.currentY - this.startY >=
      Number(this.props.pullDownToRefreshThreshold)
    ) {
      this.setState({
        pullToRefreshThresholdBreached: true,
      });
    }
    if (this.currentY - this.startY > this.maxPullDownDistance * 1.5) return;

    if (this._infScroll) {
      this._infScroll.style.overflow = "visible";
      this._infScroll.style.transform = `translate3d(0px, ${
        this.currentY - this.startY
      }px, 0px)`;
    }
  };

  onEnd = () => {
    this.startY = 0;
    this.currentY = 0;

    this.dragging = false;

    if (this.state.pullToRefreshThresholdBreached) {
      this.props.refreshFunction && this.props.refreshFunction();
      this.setState({
        pullToRefreshThresholdBreached: false,
      });
    }

    requestAnimationFrame(() => {
      if (this._infScroll) {
        this._infScroll.style.overflow = "auto";
        this._infScroll.style.transform = "none";
        this._infScroll.style.willChange = "unset";
      }
    });
  };

  isElementAtTop(target, scrollThreshold = 0.8) {
    const clientHeight =
      target === document.body || target === document.documentElement
        ? window.screen.availHeight
        : target.clientHeight;

    const threshold = parseThreshold(scrollThreshold);

    if (threshold.unit === ThresholdUnits.Pixel) {
      return (
        target.scrollTop <=
        threshold.value + clientHeight - target.scrollHeight + 1
      );
    }

    return (
      target.scrollTop <=
      threshold.value / 100 + clientHeight - target.scrollHeight + 1
    );
  }

  isElementAtBottom(target, scrollThreshold = 0.8) {
    const clientHeight =
      target === document.body || target === document.documentElement
        ? window.screen.availHeight
        : target.clientHeight;

    const threshold = parseThreshold(scrollThreshold);

    if (threshold.unit === ThresholdUnits.Pixel) {
      return (
        target.scrollTop + clientHeight >= target.scrollHeight - threshold.value
      );
    }

    return (
      target.scrollTop + clientHeight >=
      (threshold.value / 100) * target.scrollHeight
    );
  }

  onScrollListener = (event) => {
    const target = this.props.height
      ? event.target
      : document.documentElement.scrollTop
      ? document.documentElement
      : document.body;
    if (this.actionTriggered) return;
    if (
      this.isElementAtBottom(target, this.props.scrollThreshold) &&
      this.props.hasMore
    ) {
      this.actionTriggered = true;
      this.setState({ showLoader: true });
      this.props.next && this.props.next(this.errorSubmit);
    }

    this.lastScrollTop = target.scrollTop;
  };

  errorSubmit() {
    this.setState({ showLoader: false });
    this.actionTriggered = false;
  }

  render() {
    const hasChildren = !!(
      this.props.children &&
      this.props.children instanceof Array &&
      this.props.children.length
    );

    return (
      <div className="infinite-scroll-component__outerdiv">
        <div
          className={`infinite-scroll-component ${this.props.className || ""}`}
          ref={(infScroll) => (this._infScroll = infScroll)}
          style={{
            height: "auto",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {this.props.pullDownToRefresh && (
            <div
              style={{ position: "relative" }}
              ref={(pullDown) => (this._pullDown = pullDown)}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: -1 * this.maxPullDownDistance,
                }}
              >
                {this.state.pullToRefreshThresholdBreached
                  ? this.props.releaseToRefreshContent
                  : this.props.pullDownToRefreshContent}
              </div>
            </div>
          )}
          {this.props.children}
          {!this.state.showLoader &&
            !hasChildren &&
            this.props.hasMore &&
            this.props.loader}
          {this.state.showLoader && this.props.hasMore && this.props.loader}
          {!this.props.hasMore && this.props.endMessage}
        </div>
      </div>
    );
  }
}

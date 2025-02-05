/**
 * Provides the UI elements of a user menu.
 *
 * @author Alexander Ebert
 * @copyright 2001-2021 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module WoltLabSuite/Core/Ui/User/Menu/View
 * @woltlabExcludeBundle tiny
 */

import { UserMenuButton, UserMenuData, UserMenuFooter, UserMenuProvider } from "./Data/Provider";
import { getTimeElement } from "../../../Date/Util";
import { escapeHTML } from "../../../StringUtil";
import * as DomChangeListener from "../../../Dom/Change/Listener";
import * as Language from "../../../Language";
import { createFocusTrap, FocusTrap } from "focus-trap";
import * as perfectScrollbar from "perfect-scrollbar";
import * as UiScreen from "../../Screen";
import type { DesktopNotifications } from "./Data/Notification";

export class UserMenuView {
  private readonly element: HTMLElement;
  private usePerfectScrollbar = false;
  private readonly focusTrap: FocusTrap;
  private readonly markAllAsReadButton: HTMLElement;
  private readonly provider: UserMenuProvider;

  constructor(provider: UserMenuProvider) {
    this.provider = provider;
    this.element = document.createElement("div");

    this.buildElement();

    this.markAllAsReadButton = this.buildButton({
      icon: '<span class="icon icon24 fa-check"></span>',
      link: "#",
      name: "markAllAsRead",
      title: Language.get("wcf.global.button.markAllAsRead"),
    });

    this.focusTrap = createFocusTrap(this.element, {
      allowOutsideClick: true,
      escapeDeactivates: (): boolean => {
        // Intercept the "Escape" key and close the dialog through other means.
        this.element.dispatchEvent(new Event("shouldClose"));

        return false;
      },
      fallbackFocus: this.element,
    });

    UiScreen.on("screen-lg", {
      match: () => {
        this.usePerfectScrollbar = true;
        this.rebuildScrollbar();
      },
      unmatch: () => {
        this.usePerfectScrollbar = false;
        this.rebuildScrollbar();
      },
      setup: () => {
        this.usePerfectScrollbar = true;
        this.rebuildScrollbar();
      },
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }

  async open(): Promise<void> {
    const isStale = this.provider.isStale();
    if (isStale) {
      this.reset();
    }

    this.element.hidden = false;
    this.focusTrap.activate();

    if (isStale) {
      const data = await this.provider.getData();

      this.setContent(data);
    }
  }

  close(): void {
    this.focusTrap.deactivate();

    this.element.hidden = true;
  }

  getItems(): HTMLElement[] {
    return Array.from(this.getContent().querySelectorAll(".userMenuItem"));
  }

  private setContent(data: UserMenuData[]): void {
    const content = this.getContent();

    this.markAllAsReadButton.remove();

    if (data.length === 0) {
      content.innerHTML = `<span class="userMenuContentStatus">${this.provider.getEmptyViewMessage()}</span>`;
    } else {
      let hasUnreadContent = false;

      const fragment = document.createDocumentFragment();
      data.forEach((itemData) => {
        if (itemData.isUnread) {
          hasUnreadContent = true;
        }

        fragment.append(this.createItem(itemData));
      });

      content.innerHTML = "";
      content.append(fragment);

      if (hasUnreadContent) {
        this.element.querySelector(".userMenuButtons")!.prepend(this.markAllAsReadButton);
      }

      DomChangeListener.trigger();
    }

    this.rebuildScrollbar();
  }

  private rebuildScrollbar(): void {
    const content = this.getContent();
    if (this.usePerfectScrollbar) {
      this.enablePerfectScrollbar(content);
    } else {
      this.disablePerfectScrollbar(content);
    }
  }

  private enablePerfectScrollbar(content: HTMLElement): void {
    if (content.dataset.psId) {
      perfectScrollbar.update(content);
    } else {
      perfectScrollbar.initialize(content, {
        suppressScrollX: true,
      });
    }
  }

  private disablePerfectScrollbar(content: HTMLElement): void {
    perfectScrollbar.destroy(content);
  }

  private createItem(itemData: UserMenuData): HTMLElement {
    const element = document.createElement("div");
    element.classList.add("userMenuItem");
    element.dataset.objectId = itemData.objectId.toString();
    element.dataset.isUnread = itemData.isUnread ? "true" : "false";

    const link = escapeHTML(itemData.link);

    element.innerHTML = `
      <div class="userMenuItemImage">${itemData.image}</div>
      <div class="userMenuItemContent">
        <a href="${link}" class="userMenuItemLink">${itemData.content}</a>
      </div>
      <div class="userMenuItemMeta"></div>
      <div class="userMenuItemUnread">
        <a href="#" class="userMenuItemMarkAsRead" role="button">
          <span class="icon icon24 fa-check jsTooltip" title="${Language.get("wcf.global.button.markAsRead")}"></span>
        </a>
      </div>
    `;

    const time = getTimeElement(new Date(itemData.time * 1_000));
    element.querySelector(".userMenuItemMeta")!.append(time);

    const markAsRead = element.querySelector(".userMenuItemMarkAsRead")!;
    markAsRead.addEventListener("click", async (event) => {
      event.preventDefault();

      await this.provider.markAsRead(itemData.objectId);

      this.markAsRead(element);
    });

    if (itemData.usernames.length > 0) {
      const content = element.querySelector(".userMenuItemContent") as HTMLElement;
      const usernames = document.createElement("div");
      usernames.classList.add("userMenuItemUsernames");
      usernames.textContent = itemData.usernames.join(", ");
      content.insertAdjacentElement("afterend", usernames);

      element.classList.add("userMenuItemWithUsernames");
    }

    if (this.provider.hasPlainTitle()) {
      const link = element.querySelector(".userMenuItemLink") as HTMLAnchorElement;
      link.classList.add("userMenuItemLinkPlain");
    }

    return element;
  }

  private markAsRead(element: HTMLElement) {
    element.dataset.isUnread = "false";

    const unreadItems = this.getContent().querySelectorAll('.userMenuItem[data-is-unread="true"]');
    if (unreadItems.length === 0) {
      this.markAllAsReadButton.remove();
    }
  }

  private reset(): void {
    const content = this.getContent();
    content.innerHTML = `<span class="userMenuContentStatus"><span class="icon icon24 fa-spinner"></span></span>`;
  }

  private buildElement(): void {
    this.element.hidden = true;
    this.element.classList.add("userMenu");
    this.element.dataset.origin = this.provider.getPanelButton().id;
    this.element.tabIndex = -1;
    this.element.innerHTML = `
      <div class="userMenuHeader">
        <div class="userMenuTitle">${this.provider.getTitle()}</div>
        <div class="userMenuButtons"></div>
      </div>
      <div class="userMenuContent userMenuContentScrollable"></div>
    `;

    // Prevent clicks inside the dialog to close it.
    this.element.addEventListener("click", (event) => event.stopPropagation());

    const buttons = this.element.querySelector(".userMenuButtons")!;
    this.provider.getMenuButtons().forEach((button) => {
      buttons.append(this.buildButton(button));
    });

    const footer = this.provider.getFooter();
    if (footer !== null) {
      this.element.append(this.buildFooter(footer));
    }

    if (this.provider.getIdentifier() === "com.woltlab.wcf.notifications") {
      const provider = this.provider as unknown as DesktopNotifications;
      const notificationElement = provider.getDesktopNotifications();

      if (notificationElement) {
        const header = this.element.querySelector(".userMenuHeader")!;
        header.insertAdjacentElement("afterend", notificationElement);
      }
    }
  }

  private buildButton(button: UserMenuButton): HTMLElement {
    const link = document.createElement("a");
    link.setAttribute("role", "button");
    link.classList.add("userMenuButton", "jsTooltip");
    link.title = button.title;
    link.innerHTML = button.icon;

    if (button.name === "markAllAsRead") {
      link.href = "#";
      link.addEventListener("click", (event) => {
        event.preventDefault();

        this.markAllAsRead();
      });
    } else {
      link.href = button.link;
    }

    return link;
  }

  private markAllAsRead(): void {
    void this.provider.markAllAsRead();

    this.getContent()
      .querySelectorAll(".userMenuItem")
      .forEach((element: HTMLElement) => {
        element.dataset.isUnread = "false";
      });

    this.markAllAsReadButton.remove();
  }

  private buildFooter(footer: UserMenuFooter): HTMLElement {
    const link = escapeHTML(footer.link);
    const title = escapeHTML(footer.title);

    const element = document.createElement("div");
    element.classList.add("userMenuFooter");
    element.innerHTML = `<a href="${link}" class="userMenuFooterLink">${title}</a>`;

    return element;
  }

  getContent(): HTMLElement {
    return this.element.querySelector(".userMenuContent")!;
  }
}

export default UserMenuView;

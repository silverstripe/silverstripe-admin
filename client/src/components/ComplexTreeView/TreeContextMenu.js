import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';

const CSS_CLASS = 'tree-context-menu';

const TreeContextMenu = ({
  isOpen,
  position,
  node,
  onClose,
  onMenuAction,
  contextMenuUrls = null,
  labels = null,
  enableAddChild = true,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const menuRef = useRef(null);
  const submenuRef = useRef(null);
  const submenuTimeoutRef = useRef(null);

  const nodeData = node?.data || {};
  const contextMenuData = nodeData.contextMenuData || {};
  const canEdit = contextMenuData.canEdit === true;
  const allowedChildren = contextMenuData.allowedChildren || [];
  const numChildren = contextMenuData.numChildren || 0;

  useEffect(() => {
    if (!isOpen) {
      setOpenSubmenu(null);
      return () => {};
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, [isOpen, onClose]);

  const handleMenuItemClick = (action, payload = null) => {
    if (payload !== null) {
      onMenuAction(action, node.data.id, payload);
    } else {
      onMenuAction(action, node.data.id);
    }
    onClose();
  };

  const handleEditClick = () => {
    handleMenuItemClick('edit');
  };

  const handleShowAsListClick = () => {
    handleMenuItemClick('showAsList');
  };

  const handleAddPageClick = (childType) => {
    handleMenuItemClick('addPage', { childType });
  };

  const handleDuplicateClick = (includeSubpages) => {
    handleMenuItemClick('duplicate', { includeSubpages });
  };

  const handleMouseEnterSubmenu = (submenuName) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    setOpenSubmenu(submenuName);
  };

  const handleMouseLeaveSubmenu = () => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    submenuTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 100);
  };

  const getColumnCount = () => {
    if (allowedChildren.length > 20) {
      return 3;
    }
    if (allowedChildren.length > 10) {
      return 2;
    }
    return 1;
  };

  const getMaxHeight = () => (allowedChildren.length > 10 ? '400px' : 'auto');

  if (!isOpen || !node) {
    return null;
  }

  const adjustedPosition = { ...position };
  const menuWidth = 220;
  const menuHeight = 300;
  const offset = 5;

  if (position.x + menuWidth > window.innerWidth) {
    adjustedPosition.x = Math.max(0, window.innerWidth - menuWidth - offset);
  }

  if (position.y + menuHeight > window.innerHeight) {
    adjustedPosition.y = Math.max(0, window.innerHeight - menuHeight - offset);
  }

  return (
    <div
      ref={menuRef}
      className={CSS_CLASS}
      style={{
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
      }}
      role="menu"
    >
      {canEdit && (
        <>
          <button
            type="button"
            className={`${CSS_CLASS}__item`}
            onClick={handleEditClick}
            role="menuitem"
          >
            {labels?.edit || i18n._t('Admin.EDIT', 'Edit')}
          </button>
          <div className={`${CSS_CLASS}__divider`} />
        </>
      )}

      {numChildren > 0 && (
        <button
          type="button"
          className={`${CSS_CLASS}__item`}
          onClick={handleShowAsListClick}
          role="menuitem"
        >
          {labels?.showAsList || i18n._t('Admin.SHOW_AS_LIST', 'Show children as list')}
        </button>
      )}

      {canEdit && allowedChildren.length > 0 && enableAddChild && (
        <div
          className={`${CSS_CLASS}__item ${CSS_CLASS}__item--submenu`}
          onMouseEnter={() => handleMouseEnterSubmenu('addPage')}
          onMouseLeave={handleMouseLeaveSubmenu}
          role="menuitem"
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={openSubmenu === 'addPage'}
        >
          <span>{labels?.addChild || i18n._t('Admin.ADD_CHILD', 'Add child')}</span>
          <span className={`${CSS_CLASS}__arrow`}>›</span>

          {openSubmenu === 'addPage' && (
            <div
              ref={submenuRef}
              className={`${CSS_CLASS}__submenu`}
              role="menu"
              style={{
                maxHeight: getMaxHeight(),
                columns: getColumnCount(),
              }}
            >
              {allowedChildren.map((childType) => (
                <button
                  key={childType.ClassName}
                  type="button"
                  className={`${CSS_CLASS}__submenu-item`}
                  onClick={() => handleAddPageClick(childType.ClassName)}
                  role="menuitem"
                >
                  {childType.Title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {canEdit && (
        <div
          className={`${CSS_CLASS}__item ${CSS_CLASS}__item--submenu`}
          onMouseEnter={() => handleMouseEnterSubmenu('duplicate')}
          onMouseLeave={handleMouseLeaveSubmenu}
          role="menuitem"
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={openSubmenu === 'duplicate'}
        >
          <span>{labels?.duplicate || i18n._t('Admin.DUPLICATE', 'Duplicate')}</span>
          <span className={`${CSS_CLASS}__arrow`}>›</span>

          {openSubmenu === 'duplicate' && (
            <div
              className={`${CSS_CLASS}__submenu`}
              role="menu"
            >
              {contextMenuUrls?.duplicate && (
                <button
                  type="button"
                  className={`${CSS_CLASS}__submenu-item`}
                  onClick={() => handleDuplicateClick(false)}
                  role="menuitem"
                >
                  {labels?.duplicateThisOnly || i18n._t('Admin.DUPLICATE_THIS_ONLY', 'This record only')}
                </button>
              )}
              {contextMenuUrls?.duplicateWithChildren && (
                <button
                  type="button"
                  className={`${CSS_CLASS}__submenu-item`}
                  onClick={() => handleDuplicateClick(true)}
                  role="menuitem"
                >
                  {labels?.duplicateWithChildren || i18n._t('Admin.DUPLICATE_WITH_CHILDREN', 'This record and children')}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

TreeContextMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  node: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      contextMenuData: PropTypes.shape({
        canEdit: PropTypes.bool,
        canCreate: PropTypes.bool,
        canDelete: PropTypes.bool,
        numChildren: PropTypes.number,
        allowedChildren: PropTypes.arrayOf(PropTypes.shape({
          ClassName: PropTypes.string.isRequired,
          Title: PropTypes.string.isRequired,
          IconClass: PropTypes.string,
        })),
      }),
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onMenuAction: PropTypes.func.isRequired,
  contextMenuUrls: PropTypes.shape({
    duplicate: PropTypes.string,
    duplicateWithChildren: PropTypes.string,
    addChild: PropTypes.string,
  }),
  labels: PropTypes.shape({
    edit: PropTypes.string,
    showAsList: PropTypes.string,
    addChild: PropTypes.string,
    duplicate: PropTypes.string,
    duplicateThisOnly: PropTypes.string,
    duplicateWithChildren: PropTypes.string,
  }),
  enableAddChild: PropTypes.bool,
};

export { TreeContextMenu as Component };
export default TreeContextMenu;

import React, { useState } from 'react';
import { categoryTreeData } from '../data/categoryTreeData';
import { ChevronRight } from 'lucide-react';

export default function MegaMenu({ activePage, setActivePage }) {
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);

  const handleCategoryClick = (categorySlug, searchKeyword) => {
    setActiveParent(null);
    setActiveChild(null);
    if (searchKeyword) {
      setActivePage(`products:search=${encodeURIComponent(searchKeyword)}`);
    } else {
      setActivePage(`products:category=${categorySlug}`);
    }
  };

  return (
    <nav style={{ position: 'relative', zIndex: 400, background: '#ffffff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', overflow: 'visible' }}>
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: '0 0.15rem',
          overflow: 'visible',
          position: 'relative'
        }}
      >
        {categoryTreeData.map((parent, index) => {
          const isParentActive = activeParent === parent.id;
          const isRightSide = index >= 9;

          return (
            <div
              key={parent.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => {
                setActiveParent(parent.id);
                if (parent.children && parent.children.length > 0) {
                  setActiveChild(parent.children[0].id);
                }
              }}
              onMouseLeave={() => {
                setActiveParent(null);
                setActiveChild(null);
              }}
            >
              {/* Parent Category Item */}
              <button
                onClick={() => handleCategoryClick(parent.slug)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0.65rem 0.2rem',
                  fontSize: 'clamp(0.70rem, 0.85vw, 0.78rem)',
                  fontWeight: 700,
                  color: isParentActive ? '#ea580c' : '#0f172a',
                  borderBottom: isParentActive ? '3px solid #ea580c' : '3px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'color 0.15s ease'
                }}
              >
                {parent.name}
              </button>

              {/* 1st Level Child Dropdown Menu */}
              {isParentActive && parent.children && parent.children.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: isRightSide ? 'auto' : 0,
                    right: isRightSide ? 0 : 'auto',
                    background: '#ffffff',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #cbd5e1',
                    borderRadius: isRightSide ? '0 0 0 8px' : '0 0 8px 8px',
                    width: '240px',
                    zIndex: 9999,
                    padding: '0.3rem 0'
                  }}
                >
                  {parent.children.map((child) => {
                    const isChildActive = activeChild === child.id;
                    const hasLeafs = child.children && child.children.length > 0;

                    return (
                      <div
                        key={child.id}
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setActiveChild(child.id)}
                      >
                        {/* Child Category Item */}
                        <div
                          onClick={() => handleCategoryClick(child.slug)}
                          style={{
                            padding: '0.55rem 1rem',
                            fontSize: '0.84rem',
                            fontWeight: isChildActive ? 800 : 600,
                            color: isChildActive ? '#ffffff' : '#0f172a',
                            background: isChildActive ? '#ea580c' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isRightSide && hasLeafs && <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} color={isChildActive ? '#ffffff' : '#64748b'} />}
                          <span>{child.name}</span>
                          {!isRightSide && hasLeafs && <ChevronRight size={14} color={isChildActive ? '#ffffff' : '#64748b'} />}
                        </div>

                        {/* 2nd Level Leaf Flyout Menu */}
                        {isChildActive && hasLeafs && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: isRightSide ? 'auto' : '100%',
                              right: isRightSide ? '100%' : 'auto',
                              background: '#ffffff',
                              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                              border: '1px solid #cbd5e1',
                              borderRadius: isRightSide ? '8px 0 8px 8px' : '0 8px 8px 8px',
                              width: '200px',
                              zIndex: 10000,
                              padding: '0.3rem 0'
                            }}
                          >
                            {child.children.map((leaf, leafIdx) => (
                              <div
                                key={leafIdx}
                                onClick={() => handleCategoryClick(child.slug, leaf)}
                                style={{
                                  padding: '0.55rem 1rem',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  color: '#1e293b',
                                  cursor: 'pointer',
                                  transition: 'background 0.15s ease, color 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#f1f5f9';
                                  e.currentTarget.style.color = '#ea580c';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = '#1e293b';
                                }}
                              >
                                {leaf}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

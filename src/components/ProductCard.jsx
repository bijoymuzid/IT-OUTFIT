import { motion } from 'framer-motion';
import './ProductCard.css';

/* ── resolve image paths based on seeded vs custom ── */
function resolveImages(product) {
  if (product.seeded) {
    const folder  = product.category === 'bottom' ? 'bottom'       : 'top';
    const hfolder = product.category === 'bottom' ? 'human-bottom' : 'human-top';
    return {
      primary: `/${folder}/${product.id}.jpeg`,
      hover:   `/${hfolder}/${product.id}.jpeg`,
    };
  }
  return {
    primary: product.image      || '',
    hover:   product.imageHover || product.image || '',
  };
}

export default function ProductCard({ product, index, tall, wide, square, onSelect }) {
  /* support legacy callers that pass flat props — wrap into object */
  const p = product ?? {};
  const { primary, hover } = resolveImages(p);

  return (
    <motion.div
      className="pcard"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      onClick={() => onSelect?.(p)}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      <div
        className={[
          'pcard__wrap',
          tall   ? 'pcard__wrap--tall'   : '',
          wide   ? 'pcard__wrap--wide'   : '',
          square ? 'pcard__wrap--square' : '',
        ].filter(Boolean).join(' ')}
      >
        {primary ? (
          <img
            src={primary}
            alt={p.name || `product ${p.id}`}
            className="pcard__img pcard__img--default"
            loading="lazy"
          />
        ) : (
          <div className="pcard__img pcard__img--placeholder" />
        )}

        <div className="pcard__hover-clip">
          {hover ? (
            <img
              src={hover}
              alt={p.name ? `${p.name} worn` : 'worn view'}
              className="pcard__img pcard__img--hover"
              loading="lazy"
            />
          ) : (
            /* fallback: show primary again so clip reveal still works */
            primary && (
              <img
                src={primary}
                alt={p.name || 'product'}
                className="pcard__img pcard__img--hover"
                loading="lazy"
              />
            )
          )}
        </div>

        {p.status === 'sold_out' && (
          <div className="pcard__sold-out">Sold Out</div>
        )}
      </div>

      {p.name && (
        <div className="pcard__meta">
          <span className="pcard__name">{p.name}</span>
          <span className="pcard__tag">● APPAREL</span>
        </div>
      )}

      <div className="pcard__info">
        <span className="pcard__price">{p.price}</span>
        <button
          className="pcard__btn"
          aria-label="Add to bag"
          onClick={(e) => e.stopPropagation()}
        >+</button>
      </div>
    </motion.div>
  );
}
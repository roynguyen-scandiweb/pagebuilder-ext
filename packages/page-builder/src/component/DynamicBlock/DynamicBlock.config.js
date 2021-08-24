export const DYNAMIC_BLOCK_SKELETON = [{
  name: 'BaseDynamicBlock', type: 'div', children: [
    {
      name: 'BannerWidget', type: 'div', children: [
        {
          name: 'BannerItems', type: 'ul', isLoopParent: true, children: [
            {
              name: 'BannerItem', type: 'li', children: [
                { name: 'BannerItemContent', type: 'div' }
              ]
            }
          ]
        }
      ]
    }
  ]
}]

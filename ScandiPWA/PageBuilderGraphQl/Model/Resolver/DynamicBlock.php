<?php

declare(strict_types=1);

namespace ScandiPWA\PageBuilderGraphQl\Model\Resolver;

use Magento\BannerPageBuilder\Model\ResourceModel\DynamicBlock\Content as DynamicBlockContent;
use Magento\CmsGraphQl\Model\Resolver\DataProvider\Page as PageDataProvider;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\Resolver\ContextInterface;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * @package ScandiPWA\PageBuilderGraphQl\Model\Resolver
 */
class DynamicBlock implements ResolverInterface
{
    /**
     * @var DynamicBlockContent
     */
    private $dynamicBlockResource;

    /**
     *
     * @param PageDataProvider $pageDataProvider
     */
    public function __construct(
        DynamicBlockContent $dynamicBlockContent,
        ScopeConfigInterface $scopeConfig
    )
    {
        $this->dynamicBlockResource = $dynamicBlockContent;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * @param Field            $field
     * @param ContextInterface $context
     * @param ResolveInfo      $info
     * @param array|null       $value
     * @param array|null       $args
     *
     * @return string[]
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        $dynamicBlock = $this->dynamicBlockResource->getById($args['id']);
        $result = [
            'content' => $dynamicBlock,
        ];

        return $result;
    }
}

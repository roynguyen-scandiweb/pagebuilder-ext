<?php

declare(strict_types=1);

namespace ScandiPWA\PageBuilderGraphQl\Model\Resolver;

use Magento\CmsGraphQl\Model\Resolver\DataProvider\Page as PageDataProvider;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\Resolver\ContextInterface;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * @package ScandiPWA\PageBuilderGraphQl\Model\Resolver
 */
class GoogleMap implements ResolverInterface
{
    /**
     *
     * @param PageDataProvider $pageDataProvider
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig
    )
    {
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
        $googleMapApiKey = $this->scopeConfig->getValue('cms/pagebuilder/google_maps_api_key');
        $result = [
            'apiKey' => $googleMapApiKey,
        ];

        return $result;
    }
}
